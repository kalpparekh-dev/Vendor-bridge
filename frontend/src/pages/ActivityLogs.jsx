import { useEffect, useState } from "react";
import API from "../services/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/activities").then((res) => setLogs(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-cyan-300">{log.module}</h2>
              <span className="text-gray-400">{log.created_at}</span>
            </div>
            <p className="mt-2">{log.description}</p>
            <p className="text-sm text-gray-400">Action: {log.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityLogs;