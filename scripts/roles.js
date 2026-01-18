/**
 * ROLE DEFINITIONS & PERMISSIONS
 * This file controls what each role can access
 */

const ROLE_PERMISSIONS = {
  admin: {
    pages: [
      "admin.html",
      "exams.html",
      "grading.html",
      "student-results.html"
    ],
    sidebar: [
      "dashboard",
      "staff",
      "attendance",
      "exams",
      "grading",
      "results"
    ]
  },

  staff: {
    pages: [
      "staff.html",
      "exams.html",
      "grading.html"
    ],
    sidebar: [
      "dashboard",
      "attendance",
      "lesson",
      "exams"
    ]
  },

  parent: {
    pages: [
      "parent-result.html"
    ],
    sidebar: [
      "dashboard",
      "results",
      "announcements"
    ]
  },

  churchAdmin: {
    pages: [
      "church-admin.html"
    ],
    sidebar: [
      "dashboard",
      "members",
      "finance",
      "events"
    ]
  },

  pastor: {
    pages: [
      "pastor.html"
    ],
    sidebar: [
      "dashboard",
      "counseling",
      "sermons"
    ]
  },

  member: {
    pages: [
      "member.html"
    ],
    sidebar: [
      "dashboard",
      "giving",
      "events"
    ]
  }
};
