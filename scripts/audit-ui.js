/**
 * AUDIT LOG UI
 * Displays audit history in admin dashboard
 */

const auditTable = document.getElementById("auditTable");

/**
 * Render logs into table
 */
function renderAuditLogs() {
  const logs = getAuditLogs();
  auditTable.innerHTML = "";

  logs.forEach(log => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${log.date}</td>
      <td>${log.actor}</td>
      <td>${log.role}</td>
      <td>${log.action}</td>
      <td>${log.target}</td>
    `;

    auditTable.appendChild(tr);
  });
}

function filterAuditLogs(keyword) {
  const logs = getAuditLogs().filter(log =>
    log.actor.toLowerCase().includes(keyword) ||
    log.action.toLowerCase().includes(keyword)
  );

  auditTable.innerHTML = "";

  logs.forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.date}</td>
      <td>${log.actor}</td>
      <td>${log.role}</td>
      <td>${log.action}</td>
      <td>${log.target}</td>
    `;
    auditTable.appendChild(tr);
  });
}


renderAuditLogs();
