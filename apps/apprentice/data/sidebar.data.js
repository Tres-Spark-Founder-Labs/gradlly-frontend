export const portalMeta = {
  name: "Apprentice",
  tagline: "Learning Portal",
};

export const sidebarData = [
  {
    title: "My Learning",
    items: [
      { label: "Home", icon: "LayoutDashboard", href: "/home" },
      {
        label: "My Courses",
        icon: "BookOpen",
        href: "/courses",
        children: [
          { label: "In Progress", href: "/courses/in-progress" },
          { label: "Completed", href: "/courses/completed" },
          { label: "Browse All", href: "/courses/browse" },
        ],
      },
      {
        label: "Assessments",
        icon: "ClipboardList",
        href: "/assessments",
        badge: { text: "2 due", variant: "warning" },
      },
      { label: "Progress", icon: "TrendingUp", href: "/progress" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Materials", icon: "FileText", href: "/materials" },
      { label: "Library", icon: "Library", href: "/library" },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        label: "Messages",
        icon: "Mail",
        href: "/messages",
        badge: { text: "3", variant: "info" },
      },
      { label: "Discussion", icon: "MessageSquare", href: "/discussion" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", icon: "User", href: "/profile" },
      { label: "Settings", icon: "Settings", href: "/settings" },
    ],
  },
];

export const profileData = {
  name: "Maya Chen",
  role: "Apprentice Developer",
  initials: "MC",
  isOnline: true,
  cohort: "Cohort 2024",
  stats: [
    { value: "154", label: "days" },
    { value: "L1", label: "level" },
  ],
};

export const progressData = {
  label: "Learning Progress",
  percent: 54,
  subtitle: "Course 6 of 11",
  detail: "On track · 3 assessments passed",
};

export const pageLabels = {
  "/home": "Home",
  "/courses": "My Courses",
  "/courses/in-progress": "In Progress",
  "/courses/completed": "Completed",
  "/courses/browse": "Browse Courses",
  "/assessments": "Assessments",
  "/progress": "My Progress",
  "/materials": "Materials",
  "/library": "Library",
  "/messages": "Messages",
  "/discussion": "Discussion",
  "/profile": "Profile",
  "/settings": "Settings",
};
