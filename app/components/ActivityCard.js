import Link from "next/link";

export default function ActivityCard({
  icon,
  title,
  description,
  href,
}) {
  return (
    <div className="activity-card">
      <div className="activity-icon">{icon}</div>

      <div className="activity-content">
        <h2>{title}</h2>

        <p>{description}</p>

        <Link href={href} className="activity-button">
          Build {title}
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}