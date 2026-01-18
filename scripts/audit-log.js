/**
 * AUDIT LOG SERVICE
 * Responsible for recording system activities
 */

/**
 * Get all logs from localStorage
 */
function getAuditLogs() {
  return JSON.parse(localStorage.getItem("auditLogs")) || [];
}

/**
 * Save logs to localStorage
 */
function saveAuditLogs(logs) {
  localStorage.setItem("auditLogs", JSON.stringify(logs));
}

/**
 * Record a new audit log
 * @param {string} actor - Who performed the action
 * @param {string} role - Role of actor
 * @param {string} action - What action was done
 * @param {string} target - Who or what was affected
 */
function recordAudit(actor, role, action, target = "-") {
  const logs = getAuditLogs();

  logs.unshift({
    id: crypto.randomUUID(),
    actor,
    role,
    action,
    target,
    date: new Date().toLocaleString()
  });

  saveAuditLogs(logs);
}
