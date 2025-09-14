# 🌸 WEEKENDLY  

**Weekendly** is a simple yet fun app to **plan your weekends**.  
Add tasks, see them beautifully arranged, export your plan as an image, and share it directly via Outlook.  
Stay productive while keeping your weekends stress-free ✨  

---

## ✨ Key Features  

- 🎯 **Activity Browsing** — Browse a curated list of activities (🥞 brunch, 🥾 hiking, 🎬 movie night, 📖 reading, 🎨 workshops, 🎶 local events).  
- 📝 **Add & Manage** — Add activities to Saturday or Sunday, edit details, remove items.  
- 🗂️ **Multiple Views** — Timeline, Card, Map, and Calendar-style views.  
- 🖱️ **Drag & Drop** — Rearrange activities easily with drag & drop (dnd-kit / react-beautiful-dnd).  
- 🖼️ **Export as PNG** — Export the overview as a high-resolution PNG using `html-to-image`.  
- 📧 **Outlook Share** — One-click to open Outlook with your plan. Optionally upload image to backend for a real attachment.  
- 🎭 **Themes & Personalization** — Choose themes (😌 Lazy, 🧗 Adventurous, 👨‍👩‍👧 Family, 🎭 Cultural) to change suggestions and UI.  
- 📅 **Long-weekend Awareness** — Detect upcoming holidays/long weekends and suggest extended plans.  
- 🗺️ **Google Maps Integration** — Discover nearby locations (Places API) and add them to your plan.  
- 💾 **Local Persistence** — Plans persist in localStorage (Zustand persist).  
- ♿ **Accessible & Responsive** — Semantic HTML, keyboard navigation, and responsive UI for mobile & desktop.  

---

## 🛠️ Tech Stack  

**Frontend**  
- ⚡ Next.js (TypeScript)  
- ⚛️ React (Client Components / App Router)  
- 🎨 TailwindCSS  
- 🎬 Framer Motion (animations)  
- 📦 Zustand (state management, persisted)  
- 🖼️ html-to-image (export PNG)  
- 🗺️ @react-google-maps/api (Maps & Places)  
- 🔄 dnd-kit / react-beautiful-dnd (drag & drop)  
- 📆 FullCalendar (calendar view, optional)

   
---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/dhruvi0105/weekendly.git
cd weekendly
```
### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the App
```bash
npm run dev
```


App will be live at 👉 http://localhost:3000/
