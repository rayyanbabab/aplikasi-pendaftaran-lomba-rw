import { db } from "./index";
import { events, competitions, ageCategories } from "./schema";

async function checkData() {
  const ev = await db.select().from(events);
  const comp = await db.select().from(competitions);
  const cat = await db.select().from(ageCategories);

  console.log("=== EVENTS ===");
  console.log(JSON.stringify(ev, null, 2));
  console.log("\n=== COMPETITIONS count:", comp.length, "===");
  console.log(JSON.stringify(comp.slice(0, 3), null, 2));
  console.log("\n=== AGE CATEGORIES ===");
  console.log(JSON.stringify(cat, null, 2));
  process.exit(0);
}

checkData().catch((e) => { console.error(e); process.exit(1); });
