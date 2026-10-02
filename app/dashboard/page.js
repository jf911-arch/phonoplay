"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load dashboard data."
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="dashboard">
        <h1>PhonoPlay Dashboard</h1>
        <p>Loading dashboard data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <h1>PhonoPlay Dashboard</h1>
        <p>{error}</p>
      </main>
    );
  }

  const isHealthy = dashboard.health.status === "healthy";
  const hasGenerationFailures = dashboard.generations.failed > 0;
  const hasActivities = dashboard.activities.total > 0;
  const hasUsageEvents = dashboard.usage.totalEvents > 0;
  const hasInvalidData = dashboard.observability.invalidDataEvents > 0;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>PhonoPlay Dashboard</h1>
          <p>Application usage and operational monitoring</p>
        </div>
      </header>

      <section className="dashboard-section">
        <h2>System Health</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="card-label">System Status</span>
            <strong>
              {isHealthy ? "Healthy" : "Unhealthy"}
            </strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">Database</span>
            <strong>
              {dashboard.health.database === "connected"
                ? "Connected"
                : "Disconnected"}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Activities</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="card-label">Total Activities</span>
            <strong>{dashboard.activities.total}</strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">Wordle</span>
            <strong>{dashboard.activities.wordle}</strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">Word Search</span>
            <strong>{dashboard.activities.wordSearch}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Generation Metrics</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="card-label">
              Successful Generations
            </span>
            <strong>{dashboard.generations.successful}</strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">
              Failed Generations
            </span>
            <strong>{dashboard.generations.failed}</strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">
              Total Generations
            </span>
            <strong>{dashboard.generations.total}</strong>
          </div>
        </div>

        <div
          className={
            hasGenerationFailures
              ? "dashboard-alert dashboard-alert-warning"
              : "dashboard-alert dashboard-alert-success"
          }
        >
          <strong>
            {hasGenerationFailures
              ? "⚠️ Generation failures detected"
              : "✓ Generation Status: Healthy"}
          </strong>

          <p>
            {hasGenerationFailures
              ? `${dashboard.generations.failed} generation${
                  dashboard.generations.failed === 1 ? "" : "s"
                } failed.`
              : "No generation failures have been recorded."}
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Usage Metrics</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="card-label">
              Average Time on Page
            </span>
            <strong>
              {dashboard.usage.averageTimeOnPageSeconds}s
            </strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">
              Most Used Activity
            </span>
            <strong>
              {dashboard.usage.mostUsedActivityType || "No data"}
            </strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">
              Total Usage Events
            </span>
            <strong>{dashboard.usage.totalEvents}</strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">
              Invalid Data Events
            </span>
            <strong>{dashboard.observability.invalidDataEvents}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Operational Alerts</h2>

        <div className="dashboard-alerts">
          <div
            className={
              hasGenerationFailures
                ? "dashboard-alert dashboard-alert-warning"
                : "dashboard-alert dashboard-alert-success"
            }
          >
            <strong>
              {hasGenerationFailures
                ? "⚠️ Generation failures detected"
                : "✓ No generation failures"}
            </strong>

            {hasGenerationFailures && (
              <p>
                {dashboard.generations.failed} failed generation
                {dashboard.generations.failed === 1 ? "" : "s"}{" "}
                recorded.
              </p>
            )}
          </div>

          <div
            className={
              hasActivities
                ? "dashboard-alert dashboard-alert-success"
                : "dashboard-alert dashboard-alert-warning"
            }
          >
            <strong>
              {hasActivities
                ? "✓ Activity data available"
                : "⚠️ No activities found"}
            </strong>

            <p>
              {hasActivities
                ? `${dashboard.activities.total} activities are currently stored in the database.`
                : "The database currently contains no activities."}
            </p>
          </div>

          <div
            className={
              hasUsageEvents
                ? "dashboard-alert dashboard-alert-success"
                : "dashboard-alert dashboard-alert-warning"
            }
          >
            <strong>
              {hasUsageEvents
                ? "✓ Usage monitoring active"
                : "⚠️ No usage data"}
            </strong>

            <p>
              {hasUsageEvents
                ? `${dashboard.usage.totalEvents} usage events have been recorded.`
                : "No usage events have been recorded yet."}
            </p>
          </div>

          <div
            className={
              hasInvalidData
                ? "dashboard-alert dashboard-alert-warning"
                : "dashboard-alert dashboard-alert-success"
            }
          >
            <strong>
              {hasInvalidData
                ? "⚠️ Invalid activity data detected"
                : "✓ No invalid activity data"}
            </strong>

            <p>
              {hasInvalidData
                ? `${dashboard.observability.invalidDataEvents} invalid activity submission${
                    dashboard.observability.invalidDataEvents === 1
                      ? ""
                      : "s"
                  } recorded.`
                : "No invalid activity submissions have been recorded."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}