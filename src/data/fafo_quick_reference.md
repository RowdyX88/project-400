# FAFO Quick Reference - Available Data

## 📊 **Current Data Inventory (5 Events)**

### **1910 - Europe (Persia Oil)**
- **Continent:** Europe  
- **FA:** Standard Oil + Shell carve up Persia oil concessions
- **Middle:** British diplomat - "Just sand and carpets out here"
- **FO:** Century of coups, wars, sanctions while BP/ExxonMobil profit
- **Tags:** oil, colonialism, Persia, corruption

### **1947 - Asia (India Partition)**  
- **Continent:** Asia
- **FA:** India independence but British leave flaming partition mess
- **Middle:** Lord Mountbatten - "Draw a neat line on map, problem solved"
- **FO:** Millions dead, trains of corpses, nuclear rivalry continues
- **Tags:** partition, India, Pakistan, Britain, independence

### **1953 - Middle East (Iran Coup)**
- **Continent:** Middle East
- **FA:** Iran's Mossadegh nationalizes oil, kicks out BP
- **Middle:** CIA cables - "Democracy is cute, but oil is cuter"
- **FO:** Shah puppet installed, SAVAK torture, backfired in 1979
- **Tags:** Iran, CIA, coup, oil, Mossadegh

### **1973 - South America (Chile Coup)**
- **Continent:** South America  
- **FA:** Chile elects socialist Allende, CIA prefers fascist generals
- **Middle:** Henry Kissinger - "Don't watch country go communist"
- **FO:** Allende dead, Pinochet dictatorship, Chicago Boys economy
- **Tags:** Chile, CIA, Pinochet, Allende, coup

### **1994 - Africa (Rwanda Genocide)**
- **Continent:** Africa
- **FA:** Rwanda genocide while UN wags fingers, NATO shrugs  
- **Middle:** UN Secretary-General - "Monitoring situation closely"
- **FO:** Watched machetes swing on CNN, no oil = no intervention
- **Tags:** Rwanda, genocide, UN, NATO, Africa

---

## 🎯 **Available Filter Combinations**

### **By Continent:**
- **World:** Shows all 5 events
- **Europe:** 1910 Persia oil
- **Asia:** 1947 India partition
- **Middle East:** 1953 Iran coup  
- **South America:** 1973 Chile coup
- **Africa:** 1994 Rwanda genocide
- **North America, Australia, Antarctica:** No data yet

### **By Year:**
- **1910:** Europe (Persia oil)
- **1947:** Asia (India partition)
- **1953:** Middle East (Iran coup)
- **1973:** South America (Chile coup) ← **DEFAULT**
- **1994:** Africa (Rwanda genocide)

---

## 🚀 **Expansion Priorities**

### **Missing Decades:**
- **1920s-1940s:** Great Depression, WWII setup/aftermath
- **1980s-1990s:** Cold War endgame, tech bubble beginnings
- **2000s-2010s:** Iraq/Afghanistan wars, 2008 financial crisis
- **2010s-2020s:** Tech surveillance, pandemic responses

### **Underrepresented Continents:**
- **North America:** Only 5 events needed
- **Australia:** Pacific exploitation, mining companies
- **Antarctica:** Rare but possible (territorial claims, research)

### **Top Content Themes to Add:**
1. **Corporate Pharma:** Opioid crisis, vaccine profiteering
2. **Big Tech:** Surveillance capitalism, privacy destruction  
3. **Military Industrial:** Arms deals, forever wars
4. **Financial System:** Banking crises, bailout hypocrisy
5. **Environmental:** Climate promises vs. fossil fuel reality

---

## 📝 **Quick Add Template**

```json
{
  "year": YYYY,
  "continent": "REGION",
  "fa": "Setup/goal/promise - what was supposed to happen",
  "middle": {
    "actor": "Specific person or institution name",
    "quote": "'Actual quote or believable paraphrase'",
    "image": "https://placeholder-or-real-url.jpg"
  },
  "fo": "Savage aftermath commentary - no mercy, expose hypocrisy",
  "tags": ["keyword1", "keyword2", "keyword3", "etc"]
}
```

**Current File:** `/src/data/fafo_new.json`  
**Schema:** `/src/data/schema/fafo_event.schema.json`  
**Full Docs:** `/src/data/fafo_schema.md`
