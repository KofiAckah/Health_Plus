import { faHeart, faFire, faBandage } from "@fortawesome/free-solid-svg-icons";

export const firstAidTips = [
  {
    id: 1,
    category: "Medical",
    icon: faHeart,
    tips: [
      {
        title: "Heart Attack",
        steps: [
          "Call emergency services immediately",
          "Have the person sit down and rest",
          "Loosen any tight clothing",
          "If the person is conscious, give aspirin if available",
        ],
      },
      {
        title: "Choking",
        steps: [
          "Perform the Heimlich maneuver",
          "Stand behind the person",
          "Make a fist with one hand",
          "Give abdominal thrusts until object is expelled",
        ],
      },
    ],
  },
  {
    id: 2,
    category: "Fire Safety",
    icon: faFire,
    tips: [
      {
        title: "In Case of Fire",
        steps: [
          "Get out immediately",
          "Call fire services",
          "Stay low to avoid smoke",
          "Use stairs, not elevators",
        ],
      },
      {
        title: "Burns",
        steps: [
          "Cool the burn under cold running water",
          "Remove any jewelry or tight items",
          "Cover with sterile gauze",
          "Seek medical attention for serious burns",
        ],
      },
    ],
  },
  {
    id: 3,
    category: "Injuries",
    icon: faBandage,
    tips: [
      {
        title: "Cuts and Scrapes",
        steps: [
          "Clean the wound with soap and water",
          "Apply antibiotic ointment",
          "Cover with a sterile bandage",
          "Change dressing daily",
        ],
      },
      {
        title: "Sprains",
        steps: [
          "Apply RICE (Rest, Ice, Compression, Elevation)",
          "Use ice packs for 20 minutes at a time",
          "Wrap with an elastic bandage",
          "Keep the injured area elevated",
        ],
      },
    ],
  },
];
