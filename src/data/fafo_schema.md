# FA/FO Goals & Bills System - Complete Documentation & Schema

## 🎯 **System Overview**

The FA/FO Goals & Bills system is a brutal historical timeline that exposes the gap between political promises (FA - Financial Assistance/Foreign Aid) and savage reality (FO - Financial Operations/Fallout). This system uses a 3-panel interactive interface where users can filter events by continent and year to see the complete picture of historical hypocrisy.

### **Core Concept:**
- **FA (Goals)** = The setup, the promise, the noble intention
- **Middle Man** = The politician/institution making the pitch with quotes and spin
- **FO (Fallout)** = The savage aftermath, the real consequences, the dark comedy

---

## 🏗️ **Technical Architecture**

### **File Structure:**
```
src/data/
├── fafo_new.json          # Main data file with event entries
├── fafo_schema.md         # This documentation file
└── schema/
    ├── fafo_event.schema.json    # JSON schema validation
    └── fafo_continent.schema.json # Continent validation
```

### **Frontend Components:**
- **Continent Filter Panel** - Top horizontal bar with clickable continent buttons
- **FA Panel** - Left panel showing the historical setup/goal
- **Middle Panel** - Center panel with actor quotes and images  
- **FO Panel** - Right panel with brutal fallout commentary
- **Year Slider** - Bottom horizontal bar for temporal filtering

---

## 📊 **Data Schema**

### **Primary Data Structure:**
```json
[
  {
    "year": INTEGER,           // 4-digit year (1900-2025)
    "continent": STRING,       // Geographic/political region
    "fa": STRING,             // The setup/goal (detailed narrative)
    "middle": {
      "actor": STRING,        // Person/institution making the pitch
      "quote": STRING,        // Actual quote or paraphrased statement
      "image": STRING         // URL to actor's photo
    },
    "fo": STRING,             // Savage fallout commentary
    "tags": [STRING, ...]     // Searchable keywords
  }
]
```

### **Continent Categories:**
- `"World"` - Global events affecting multiple regions
- `"Asia"` - Asian continent events
- `"Africa"` - African continent events  
- `"Europe"` - European continent events
- `"North America"` - North American events
- `"South America"` - South American events
- `"Australia"` - Australia/Oceania events
- `"Antarctica"` - Antarctic region events (rare)
- `"Middle East"` - Special designation for Middle Eastern events

### **Year Range:**
- **Historical Range:** 1900-2025
- **Current Data:** 1910, 1947, 1953, 1973, 1994
- **Future Expansion:** Any year within range

---

## 💀 **Content Style Guide**

### **FA (Goals) Writing Style:**
- **Tone:** Factual but with undertones of skepticism
- **Length:** 1-3 sentences, detailed context
- **Focus:** What was promised, planned, or intended
- **Example:** "Iran's Prime Minister Mossadegh dared to nationalize oil, kicking out BP. CIA + MI6 said 'hold my whiskey' and staged a coup."

### **Middle Man Requirements:**
- **Actor:** Specific person or institution (no generic titles)
- **Quote:** Real quote preferred, believable paraphrase acceptable
- **Image:** Working URL or placeholder-friendly
- **Style:** Should capture the arrogance, delusion, or spin of the moment

### **FO (Fallout) Writing Style:**  
- **Tone:** Dark humor, savage commentary, no mercy
- **Length:** 2-4 sentences with escalating brutality
- **Focus:** Long-term consequences, hypocrisy exposure, bitter irony
- **Language:** Sharp, sarcastic, pulls no punches
- **Targets:** Corporations, politicians, institutions, anyone complicit

### **Tags Guidelines:**
- 3-6 tags per event
- Include: countries, organizations, economic terms, political concepts
- Avoid: generic words like "politics" or "history"
- Example: `["Iran", "CIA", "coup", "oil", "Mossadegh"]`

---

## 🔥 **Example Data Entries**

### **Template Entry:**
```json
{
  "year": 1973,
  "continent": "South America", 
  "fa": "Chile elects socialist Salvador Allende. CIA + Kissinger: 'Nah, we prefer fascist generals with sunglasses.' Coup incoming.",
  "middle": {
    "actor": "Henry Kissinger",
    "quote": "'I don't see why we need to stand by and watch a country go communist due to the irresponsibility of its people.'",
    "image": "https://upload.wikimedia.org/kissinger.jpg"
  },
  "fo": "Allende dead, Pinochet in power, thousands disappeared, and Chile's economy sold to Chicago Boys like a neoliberal yard sale. Kissinger still got a Nobel Prize — comedy gold.",
  "tags": ["Chile", "CIA", "Pinochet", "Allende", "coup"]
}
```

### **Corporate Greed Entry:**
```json
{
  "year": 1910,
  "continent": "Europe",
  "fa": "Standard Oil and Royal Dutch Shell carved up Persia like a birthday cake, bribing the Shah for oil concessions.",
  "middle": {
    "actor": "British diplomat (anonymous but smug as hell)",
    "quote": "'It's just sand and carpets out here. Let us handle the boring black goo.'",
    "image": "https://upload.wikimedia.org/british_diplomat.jpg"
  },
  "fo": "Persia got pennies; the West got barrels. Result? A century of coups, wars, CIA meddling, sanctions, and an entire region on fire while ExxonMobil and BP still pop champagne on your fuel money.",
  "tags": ["oil", "colonialism", "Persia", "corruption"]
}
```

### **UN Failure Entry:**
```json
{
  "year": 1994,
  "continent": "Africa",
  "fa": "Rwanda genocide: UN wagged fingers, NATO shrugged, France played double agent. A million dead while the world argued about 'mandates.'",
  "middle": {
    "actor": "UN Secretary-General Boutros Boutros-Ghali",
    "quote": "'We are monitoring the situation very closely.'",
    "image": "https://upload.wikimedia.org/un_logo.jpg"
  },
  "fo": "Monitoring = watching machetes swing on CNN. Western powers intervened late, if at all, because Rwanda had no oil. But hey, lots of guilt-ridden memoirs got published after.",
  "tags": ["Rwanda", "genocide", "UN", "NATO", "Africa"]
}
```

---

## 🎮 **User Interface Behavior**

### **Filtering Logic:**
1. **Continent Selection:**
   - `"World"` = Shows all events regardless of continent
   - Any specific continent = Shows only events tagged with that continent
   - Visual feedback on button click (green flash)

2. **Year Slider:**
   - Range: 1900-2025
   - Real-time filtering as user drags
   - Current year display updates dynamically
   - Only shows events matching exact year

3. **Combined Filtering:**
   - Continent + Year filters work together
   - No matches = "No events found" placeholder
   - Single match = Full FA/Middle/FO display

### **Panel Content Display:**
- **FA Panel:** Shows `fa` content with year and continent in header
- **Middle Panel:** Shows actor image, name, and quote with styling
- **FO Panel:** Shows `fo` content with tags displayed as chips

---

## 🚀 **Adding New Content**

### **Step-by-Step Process:**
1. **Research the Event:** Find the setup, the spin, and the aftermath
2. **Identify the Middle Man:** Who was selling the narrative?
3. **Write the FA:** What was the goal/promise/intention?
4. **Find the Quote:** Real quote preferred, believable paraphrase OK
5. **Write the FO:** Go full savage, no mercy, expose the hypocrisy
6. **Add Tags:** 3-6 relevant, specific keywords
7. **Validate JSON:** Use schema validation
8. **Test Filtering:** Verify continent/year combinations work

### **Content Guidelines:**
- **Historical Accuracy:** Facts must be verifiable
- **Savage Commentary:** FO should be brutal but intelligent
- **No Sacred Cows:** Target any institution, leader, or corporation
- **Global Perspective:** Cover all continents and decades
- **Dark Humor:** Make it sting, make it memorable

---

## 📁 **File Management**

### **Data File Location:**
```
/src/data/fafo_new.json
```

### **Backup Strategy:**
- Keep original `fafo.json` as backup
- Version control all changes via git
- Export data periodically for external backup

### **Validation:**
```bash
# Test JSON validity
node -e "console.log(JSON.parse(require('fs').readFileSync('./src/data/fafo_new.json')))"

# Check data structure
curl http://localhost:5511/src/data/fafo_new.json | jq '.[0]'
```

---

## 🎯 **Future AI Instructions**

### **When User Requests New Content:**
1. **Read this schema file completely**
2. **Follow the exact JSON structure**
3. **Match the writing style (savage FO, factual FA)**
4. **Include working image URLs or placeholders**  
5. **Use specific, searchable tags**
6. **Verify year/continent combinations are logical**
7. **Test the entry in the browser interface**

### **Content Expansion Priority:**
1. **Fill missing decades** (especially 1920s-1940s, 1980s-2000s)
2. **Balance continent representation** 
3. **Cover major historical themes:**
   - Corporate greed and exploitation
   - Military-industrial complex
   - Colonial and neo-colonial adventures
   - Financial system manipulation
   - UN/NATO/institutional failures
   - Pharmaceutical and tech industry abuse
   - Environmental destruction for profit

### **Writing Voice:**
- **Merciless but intelligent**
- **Factual foundation with savage commentary**
- **Names names, exposes hypocrisy**
- **Dark humor that makes people think**
- **No political correctness, equal opportunity roasting**

---

## 🔧 **Technical Integration**

### **JavaScript Functions:**
- `loadFAFOData()` - Fetches JSON data
- `selectContinent(continent)` - Handles continent filtering
- `updateYear(year)` - Handles year slider changes
- `updatePanels()` - Refreshes all three panels
- `getFilteredData()` - Combines continent + year filtering

### **HTML Element IDs:**
- `#fa-panel` - Left panel container
- `#middle-panel` - Center panel container  
- `#fo-panel` - Right panel container
- `#year-slider` - Year range input
- `#current-year` - Year display span

### **CSS Classes:**
- Tailwind-based styling for responsive design
- Glass morphism effect for panels
- Smooth transitions and hover effects

---

## 📈 **Success Metrics**

### **Content Quality:**
- Events are historically accurate
- Commentary is savage but intelligent  
- Quotes are believable/verifiable
- Tags are specific and useful

### **User Experience:**
- Filtering works smoothly
- Content loads quickly
- Interface is intuitive
- All continents/years have content

### **System Health:**
- JSON validates correctly
- No broken image links
- Console shows no errors
- All functions work as expected

---

**Last Updated:** September 9, 2025  
**Data Entries:** 5 events (1910, 1947, 1953, 1973, 1994)  
**System Status:** ✅ Fully Operational  
**Next Priority:** Expand to 50+ events covering all decades and continents
