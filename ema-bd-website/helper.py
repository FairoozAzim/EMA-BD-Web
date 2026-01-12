import json

with open("NewTeam.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for member in data:
    member["year"] = "2026"
    member['Position'] =  member['Position'] + ' - ' + member['TeamName']
    
# 3. Save back to file
with open("members_updated.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
