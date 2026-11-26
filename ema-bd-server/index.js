const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters.");
}

const app = express();
const port = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json());

//listening to port
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});

//mongo connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ema-bd.hk4ihbq.mongodb.net/?retryWrites=true&w=majority&appName=EMA-BD`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use original filename
  },
});

const upload = multer({ storage: storage });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("EMA-BD-Website");
    const memberCollection = db.collection("Members");
    const eventCollection = db.collection("Events");
    const blogCollection = db.collection("Blogs");
    const alumniCollection = db.collection("StudentsAlumni");
    const commentCollection = db.collection("Comments");
    const supportedRoles = [
      "SuperAdmin",
      "Monitor",
      "EventManager",
      "StudentManager",
      "HomeViewer",
    ];
    const accountQuery = {
      email: { $type: "string" },
      password: { $type: "string" },
    };
    const publicMemberProjection = {
      _id: 1,
      url: 1,
      linkedIn: 1,
      name: 1,
      position: 1,
      email: 1,
      about: 1,
      year: 1,
    };
    const publicStudentProjection = { _accountLinkRevision: 0 };
    try {
      await memberCollection.createIndex(
        { studentId: 1 },
        {
          unique: true,
          partialFilterExpression: { studentId: { $type: "objectId" } },
          name: "unique_student_account_link",
        },
      );
    } catch (error) {
      console.error("Unable to enforce unique student-account links:", error);
    }

    const isValidObjectId = (id) =>
      typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

    const authenticate = async (req, res, next) => {
      const authorization = req.get("authorization") || "";
      const match = /^Bearer ([^\s]+)$/.exec(authorization);

      if (!match) {
        return res.status(401).json({ message: "Authentication required." });
      }

      const token = match[1];
      let payload;
      try {
        payload = jwt.verify(token, jwtSecret);
      } catch {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      if (!payload?.userId || !isValidObjectId(payload.userId)) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      try {
        const account = await memberCollection.findOne({
          _id: new ObjectId(payload.userId),
          ...accountQuery,
        });

        if (!account) {
          return res.status(401).json({ message: "Account is unavailable." });
        }

        req.authenticatedAccount = account;
        next();
      } catch (error) {
        console.error("Error authenticating request:", error);
        res.status(500).json({ message: "Unable to authenticate request." });
      }
    };

    const requireSuperAdmin = (req, res, next) => {
      if (!Array.isArray(req.authenticatedAccount?.adminType)) {
        return res.status(403).json({ message: "SuperAdmin access required." });
      }

      if (!req.authenticatedAccount.adminType.includes("SuperAdmin")) {
        return res.status(403).json({ message: "SuperAdmin access required." });
      }

      next();
    };

    const requireAnyRole = (...roles) => (req, res, next) => {
      const accountRoles = req.authenticatedAccount?.adminType;
      if (
        !Array.isArray(accountRoles) ||
        !accountRoles.some((role) => roles.includes(role))
      ) {
        return res.status(403).json({ message: "Insufficient permissions." });
      }

      next();
    };

    const requireEventManagement = requireAnyRole(
      "SuperAdmin",
      "Monitor",
      "EventManager",
    );
    const requireBlogManagement = requireAnyRole("SuperAdmin", "Monitor");

    const validateRoles = (roles, allowEmpty = false) => {
      if (
        !Array.isArray(roles) ||
        (!allowEmpty && roles.length === 0) ||
        roles.some(
          (role) =>
            typeof role !== "string" || !supportedRoles.includes(role),
        ) ||
        new Set(roles).size !== roles.length
      ) {
        return "Select one or more distinct supported roles.";
      }

      return null;
    };

    const safeAccount = (account) => ({
      _id: account._id.toString(),
      name: account.name || account.Name || "",
      email: account.email,
      adminType: Array.isArray(account.adminType) ? account.adminType : [],
      studentId: account.studentId ? account.studentId.toString() : null,
    });

    const countSuperAdminAccounts = (session) =>
      memberCollection.countDocuments(
        {
          ...accountQuery,
          adminType: "SuperAdmin",
        },
        session ? { session } : undefined,
      );

    const ensureLastSuperAdminRemains = async (
      account,
      roles,
      session,
    ) => {
      if (
        !account.adminType?.includes("SuperAdmin") ||
        roles.includes("SuperAdmin")
      ) {
        return null;
      }

      const count = await countSuperAdminAccounts(session);
      return count <= 1
        ? "The last SuperAdmin role cannot be removed."
        : null;
    };

    const withRoleChangeLock = async (session, operation) => {
      const lockAccount = await memberCollection.findOne(accountQuery, {
        session,
        sort: { _id: 1 },
        projection: { _id: 1 },
      });

      if (!lockAccount) {
        throw new Error("No login account is available for role management.");
      }

      await memberCollection.updateOne(
        { _id: lockAccount._id },
        { $inc: { _roleRevision: 1 } },
        { session },
      );

      return operation();
    };

    const isTransactionUnavailable = (error) =>
      error.code === 20 ||
      error.codeName === "IllegalOperation" ||
      error.message?.includes("Transaction numbers are only allowed");

    const editableStudentFields = {
      Name: 200,
      Email: 320,
      ProgramName: 200,
      Session: 100,
      UniName: 1000,
      About: 5000,
      FBLink: 2000,
      LinkedIn: 2000,
      OtherLink: 2000,
    };
    // Load JSON
    // const mappings = JSON.parse(fs.readFileSync('abc.json', "utf8"));

    // // Prepare bulk operations
    // const ops = mappings.map(m => ({
    //   updateOne: {
    //     filter: { Email: m.Email },
    //     update: { $set: { ID: m.ID } }
    //   }
    // }));

    // const result = await alumniCollection.bulkWrite(ops);
    // console.log("Matched:", result.matchedCount);
    // console.log("Modified:", result.modifiedCount);
    // ======================Login Endpoint =======================================
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Email and password are required." });
      }

      try {
        const user = await memberCollection.findOne({ email });

        if (
          !user ||
          typeof user.password !== "string" ||
          !(await bcrypt.compare(password, user.password))
        ) {
          return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
          { userId: user._id.toString() },
          jwtSecret,
          { expiresIn: "24h" },
        );

        res.status(200).json({
          message: "Login Successful",
          email: user.email,
          role: Array.isArray(user.adminType) ? user.adminType : [],
          token,
        });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Unable to complete login." });
      }
    });

    //=============================== EVENT ==========================================
    // ===========================Event Post

    app.post("/events", authenticate, requireEventManagement, upload.single("banner"), (req, res) => {
      console.log(req.file);
      // res.send("Found the data");
      const newEvent = req.body;
      newEvent.banner = req.file.filename;
      console.log(newEvent);
      eventCollection
        .insertOne(newEvent)
        .then((eventDes) => {
          res.status(200).send({
            message: "Event posted successfully",
            data: eventDes,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: "Something went wrong! Please try again.",
            error,
          });
        });
    });

    //the route to images uploaded using forms
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // ===========================Event Get

    app.get("/events", async (req, res) => {
      const cursor = eventCollection.find();
      const eventsList = await cursor.toArray();
      // console.log(eventsList);
      res.send(eventsList);
    });

    // ===========================Event Get by ID

    app.get("/events/:eventId", async (req, res) => {
      const eventId = req.params.eventId;
      console.log(eventId);
      try {
        // Find the requested event
        const query = { _id: new ObjectId(eventId) };
        const event = await eventCollection.findOne(query);

        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        // Find the previous and next events
        const [previousEvent, nextEvent] = await Promise.all([
          eventCollection
            .find({ _id: { $lt: eventId } })
            .sort({ _id: -1 })
            .limit(1),
          eventCollection
            .find({ _id: { $gt: eventId } })
            .sort({ _id: 1 })
            .limit(1),
        ]);
        console.log(nextEvent);
        const response = {
          event,
          links: {
            previous: previousEvent ? `/events/${previousEvent._id}` : null,
            next: nextEvent ? `/events/${nextEvent._id}` : null,
          },
        };
        res.json(response);
      } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // =========================== Event Edit
    app.put("/events/:eventId", authenticate, requireEventManagement, upload.single("banner"), async (req, res) => {
      const eventId = req.params.eventId;

      try {
        const { title, date, time, place, org, link, desc } = req.body;

        const updatedFields = {
          title,
          date,
          time,
          place,
          org,
          link,
          desc,
        };

        // Update banner only if a new file was uploaded
        if (req.file) {
          updatedFields.banner = req.file.filename;
        }

        // Remove fields that were not provided
        Object.keys(updatedFields).forEach((key) => {
          if (updatedFields[key] === undefined) {
            delete updatedFields[key];
          }
        });

        const result = await eventCollection.updateOne(
          { _id: new ObjectId(eventId) },
          { $set: updatedFields },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
          message: "Event updated successfully",
          data: { eventId, ...updatedFields },
        });
      } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({
          message: "Something went wrong while updating the event.",
          error: error.message,
        });
      }
    });

    //===========================Event Delete

    app.delete("/events/:eventId", authenticate, requireEventManagement, async (req, res) => {
      const eventId = req.params.eventId;
      console.log("Id to delete:", req.params);
      const query = { _id: new ObjectId(eventId) };
      eventCollection
        .deleteOne(query)
        .then((deleted) => {
          res.status(200).send({
            message: "Deleted Successfully",
            data: eventId,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: "Something went wrong! Please try again.",
            error,
          });
        });
    });
    // ===========================BLOG =====================================

    //===========================Blog Post
    app.post("/blogs", authenticate, requireBlogManagement, upload.single("blogImage"), async (req, res) => {
      try {
        const { title, author, date, time, text } = req.body;

        if (!title || !author || !text || !req.file) {
          return res.status(400).json({
            message: "Title, author, content and cover image are required.",
          });
        }

        const newBlog = {
          title,
          author,
          date,
          time,
          text,
          blogImage: req.file.filename,
          likes: 0,
        };

        const result = await blogCollection.insertOne(newBlog);

        res.status(201).json({
          message: "Blog posted successfully.",
          data: {
            ...newBlog,
            _id: result.insertedId,
          },
        });
      } catch (error) {
        console.error("Error creating blog:", error);

        res.status(500).json({
          message: "Something went wrong while creating the blog.",
          error: error.message,
        });
      }
    });

    //===========================Blog Comment
    app.post("/blogComment", (req, res) => {
      const newComment = req.body;

      console.log("comment: ", newComment);
      commentCollection
        .insertOne(newComment)
        .then((comment) => {
          res.status(200).send({
            message: "Comment posted successfully",
            data: newComment,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: "Something went wrong! Please try again.",
            error,
          });
        });
    });

    //===========================Get Blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find();
      const blogsList = await cursor.toArray();
      // console.log(blogsList);
      res.send(blogsList);
    });
    app.post("/blogs/like/:blogId", async (req, res) => {
      const blogId = req.params.blogId;
      console.log(blogId);

      try {
        const result = await blogCollection.updateOne(
          { _id: new ObjectId(blogId) },
          { $inc: { likes: 1 } },
        );

        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Blog liked successfully" });
        } else {
          res.status(404).send({ message: "Blog not found" });
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Something went wrong! Please try again.", error });
      }
    });

    //==========================Get Blog by ID
    app.get("/blogs/:blogId", async (req, res) => {
      const blogId = req.params.blogId;
      console.log(blogId);
      const oId = new ObjectId(blogId);
      blogCollection
        .find({ _id: oId })
        .next()
        .then((blog) => {
          if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
          }

          res.status(200).json({
            message: "Data extracted successfully",
            data: blog,
          });
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });

    // =========================== BLOG EDIT ===========================

    app.put("/blogs/:blogId", authenticate, requireBlogManagement, upload.single("blogImage"), async (req, res) => {
      const { blogId } = req.params;

      try {
        if (!ObjectId.isValid(blogId)) {
          return res.status(400).json({ message: "Invalid blog ID." });
        }

        const { title, author, date, time, text } = req.body;

        const updatedFields = {};

        if (title !== undefined) updatedFields.title = title;
        if (author !== undefined) updatedFields.author = author;
        if (date !== undefined) updatedFields.date = date;
        if (time !== undefined) updatedFields.time = time;
        if (text !== undefined) updatedFields.text = text;

        // Replace the cover image only if a new one was uploaded.
        if (req.file) {
          updatedFields.blogImage = req.file.filename;
        }

        if (Object.keys(updatedFields).length === 0) {
          return res.status(400).json({
            message: "No changes provided.",
          });
        }

        const result = await blogCollection.updateOne(
          { _id: new ObjectId(blogId) },
          { $set: updatedFields },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Blog not found." });
        }

        res.status(200).json({
          message: "Blog updated successfully.",
          data: { blogId, ...updatedFields },
        });
      } catch (error) {
        console.error("Error updating blog:", error);

        res.status(500).json({
          message: "Something went wrong while updating the blog.",
          error: error.message,
        });
      }
    });

    // =========================== BLOG DELETE ===========================

    app.delete("/blogs/:blogId", authenticate, requireBlogManagement, async (req, res) => {
      const { blogId } = req.params;

      try {
        if (!ObjectId.isValid(blogId)) {
          return res.status(400).json({ message: "Invalid blog ID." });
        }

        const result = await blogCollection.deleteOne({
          _id: new ObjectId(blogId),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            message: "Blog not found.",
          });
        }

        res.status(200).json({
          message: "Blog deleted successfully.",
          deletedCount: result.deletedCount,
        });
      } catch (error) {
        console.error("Error deleting blog:", error);

        res.status(500).json({
          message: "Something went wrong while deleting the blog.",
          error: error.message,
        });
      }
    });

    //===================================Alumni============================
    //get all alumni
    app.get("/alumni", async (req, res) => {
      const cursor = alumniCollection.find(
        {},
        { projection: publicStudentProjection },
      );
      const alumniList = await cursor.toArray();
      // console.log(alumniList);
      res.send(alumniList);
    });

    app.patch(
      "/alumni/:id",
      authenticate,
      requireSuperAdmin,
      async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
          return res.status(400).json({ message: "Invalid student ID." });
        }

        if (
          !req.body ||
          typeof req.body !== "object" ||
          Array.isArray(req.body)
        ) {
          return res.status(400).json({ message: "Invalid request body." });
        }

        const fields = Object.keys(req.body);
        if (
          fields.length === 0 ||
          fields.some((field) => !Object.hasOwn(editableStudentFields, field))
        ) {
          return res.status(400).json({
            message: "Provide student profile fields that can be edited.",
          });
        }

        const updatedFields = {};
        for (const [field, value] of Object.entries(req.body)) {
          if (
            typeof value !== "string" ||
            value.length > editableStudentFields[field]
          ) {
            return res.status(400).json({
              message: `${field} must be a string no longer than ${editableStudentFields[field]} characters.`,
            });
          }

          const normalizedValue = value.trim();
          if (field === "Name" && !normalizedValue) {
            return res.status(400).json({ message: "Name cannot be empty." });
          }

          if (["FBLink", "OtherLink"].includes(field) && normalizedValue) {
            let url;
            try {
              url = new URL(normalizedValue);
            } catch {
              return res.status(400).json({
                message: `${field} must be a valid HTTP or HTTPS URL.`,
              });
            }

            if (!["http:", "https:"].includes(url.protocol)) {
              return res.status(400).json({
                message: `${field} must use HTTP or HTTPS.`,
              });
            }
          }

          if (
            field === "Email" &&
            normalizedValue &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)
          ) {
            return res.status(400).json({ message: "Enter a valid email address." });
          }

          updatedFields[field] = normalizedValue;
        }

        try {
          const result = await alumniCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields },
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Student not found." });
          }

          const student = await alumniCollection.findOne({
            _id: new ObjectId(id),
          }, { projection: publicStudentProjection });
          if (!student) {
            return res.status(404).json({ message: "Student not found." });
          }

          res.status(200).json({
            message: "Student profile updated successfully.",
            data: student,
          });
        } catch (error) {
          console.error("Error updating student profile:", error);
          res.status(500).json({ message: "Unable to update student profile." });
        }
      },
    );

    app.delete(
      "/alumni/:id",
      authenticate,
      requireSuperAdmin,
      async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
          return res.status(400).json({ message: "Invalid student ID." });
        }

        const studentId = new ObjectId(id);
        const session = client.startSession();
        let deleted = false;
        try {
          await session.withTransaction(async () => {
            deleted = false;
            const student = await alumniCollection.findOne(
              { _id: studentId },
              { session },
            );
            if (!student) return;

            await alumniCollection.updateOne(
              { _id: studentId },
              { $inc: { _accountLinkRevision: 1 } },
              { session },
            );
            await memberCollection.updateMany(
              { studentId },
              { $unset: { studentId: "" } },
              { session },
            );

            const result = await alumniCollection.deleteOne(
              { _id: studentId },
              { session },
            );
            deleted = result.deletedCount === 1;
          });

          if (!deleted) {
            return res.status(404).json({ message: "Student not found." });
          }

          res.status(200).json({
            message: "Student profile deleted. Linked login accounts were preserved.",
            deletedId: id,
          });
        } catch (error) {
          console.error("Error deleting student profile:", error);
          res
            .status(isTransactionUnavailable(error) ? 503 : 500)
            .json({ message: "Unable to safely delete student profile." });
        } finally {
          await session.endSession();
        }
      },
    );

    app.get(
      "/admin/accounts",
      authenticate,
      requireSuperAdmin,
      async (req, res) => {
        const search = typeof req.query.search === "string"
          ? req.query.search.trim().slice(0, 100)
          : "";
        const filters = [accountQuery];

        if (search) {
          const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const searchRegex = new RegExp(escapedSearch, "i");
          filters.push({
            $or: [
              { name: searchRegex },
              { Name: searchRegex },
              { email: searchRegex },
            ],
          });
        }

        try {
          const accounts = await memberCollection
            .find(
              { $and: filters },
              {
                projection: {
                  name: 1,
                  Name: 1,
                  email: 1,
                  adminType: 1,
                  studentId: 1,
                },
              },
            )
            .sort({ email: 1 })
            .toArray();

          res.status(200).json(
            accounts.map((account) => ({
              ...safeAccount(account),
              isCurrentUser:
                account._id.toString() ===
                req.authenticatedAccount._id.toString(),
            })),
          );
        } catch (error) {
          console.error("Error fetching administrative accounts:", error);
          res.status(500).json({ message: "Unable to fetch accounts." });
        }
      },
    );

    app.patch(
      "/admin/accounts/:id/roles",
      authenticate,
      requireSuperAdmin,
      async (req, res) => {
        const { id } = req.params;
        const { roles } = req.body || {};
        const rolesError = validateRoles(roles, true);

        if (!isValidObjectId(id)) {
          return res.status(400).json({ message: "Invalid account ID." });
        }

        if (rolesError) {
          return res.status(400).json({ message: rolesError });
        }

        const accountId = new ObjectId(id);
        if (req.authenticatedAccount._id.equals(accountId)) {
          return res.status(403).json({ message: "You cannot change your own roles." });
        }

        const session = client.startSession();
        let outcome;
        try {
          await session.withTransaction(async () => {
            outcome = undefined;
            outcome = await withRoleChangeLock(session, async () => {
              const account = await memberCollection.findOne(
                { _id: accountId, ...accountQuery },
                { session },
              );

              if (!account) {
                return { status: 404, message: "Account not found." };
              }

              const superAdminError = await ensureLastSuperAdminRemains(
                account,
                roles,
                session,
              );
              if (superAdminError) {
                return { status: 400, message: superAdminError };
              }

              await memberCollection.updateOne(
                { _id: account._id, ...accountQuery },
                { $set: { adminType: roles } },
                { session },
              );

              const updatedAccount = await memberCollection.findOne(
                { _id: account._id },
                {
                  session,
                  projection: {
                    name: 1,
                    Name: 1,
                    email: 1,
                    adminType: 1,
                    studentId: 1,
                  },
                },
              );

              return {
                status: 200,
                data: safeAccount(updatedAccount),
              };
            });
          });

          if (outcome.status !== 200) {
            return res.status(outcome.status).json({ message: outcome.message });
          }

          res.status(200).json({
            message: "Account roles updated successfully.",
            data: outcome.data,
          });
        } catch (error) {
          console.error("Error updating account roles:", error);
          res
            .status(isTransactionUnavailable(error) ? 503 : 500)
            .json({ message: "Unable to safely update account roles." });
        } finally {
          await session.endSession();
        }
      },
    );

    app.post(
      "/admin/students/:id/link-account",
      authenticate,
      requireSuperAdmin,
      (_req, res) =>
        res.status(503).json({
          message:
            "Student-account linking is disabled until account-owner confirmation is available.",
        }),
    );

    //==============================MEMBERS======================================
    //======================Get Members
    app.get("/members", async (req, res) => {
      const cursor = memberCollection.find(
        { password: { $exists: false } },
        { projection: publicMemberProjection },
      );
      const memberList = await cursor.toArray();
      // console.log(alumniList);
      res.send(memberList);
    });
    //======================Get Member by ID
    app.get("/profile/:profileId/:designation", async (req, res) => {
      const { profileId, designation } = req.params;

      if (!isValidObjectId(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID." });
      }

      if (!["team", "alumni"].includes(designation)) {
        return res.status(400).json({ message: "Invalid profile designation." });
      }

      try {
        const profile =
          designation === "team"
            ? await memberCollection.findOne(
                {
                  _id: new ObjectId(profileId),
                  password: { $exists: false },
                },
                { projection: publicMemberProjection },
              )
            : await alumniCollection.findOne({
                _id: new ObjectId(profileId),
              }, { projection: publicStudentProjection });

        if (!profile) {
          return res.status(404).json({ message: "Profile not found." });
        }

        res.status(200).json({
          message: "Data extracted successfully",
          data: profile,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    //========================checking the connection of mongodb=====================================================
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//event-data

app.get("/", (req, res) => {
  res.send("EMA BD server running");
});
