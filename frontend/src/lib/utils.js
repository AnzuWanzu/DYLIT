export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Sort functions for Homepage.jsx
export const getWeekKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const weekNumber = Math.ceil(((d - new Date(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${weekNumber}`;
};

export const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const getDayKey = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const getWeekRange = (weekKey) => {
  const [year, week] = weekKey.split("-W");
  const firstDay = new Date(year, 0, 1 + (week - 1) * 7);
  const lastDay = new Date(firstDay);
  lastDay.setDate(lastDay.getDate() + 6);
  return `${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`;
};

export const getMonthName = (monthKey) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
};

export const groupDaysBySort = (days, sortBy) => {
  const grouped = {};

  days.forEach((day) => {
    let key;
    switch (sortBy) {
      case "week":
        key = getWeekKey(day.date);
        break;
      case "month":
        key = getMonthKey(day.date);
        break;
      default:
        key = getDayKey(day.date);
        break;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(day);
  });

  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return grouped;
};

export const getSortedGroupKeys = (grouped, sortBy) => {
  return Object.keys(grouped).sort((a, b) => {
    if (sortBy === "day") {
      return new Date(b) - new Date(a);
    } else if (sortBy === "week") {
      return b.localeCompare(a);
    } else {
      return b.localeCompare(a);
    }
  });
};

export const getGroupTitle = (key, sortBy) => {
  switch (sortBy) {
    case "week":
      return `Week ${key.split("-W")[1]}, ${key.split("-W")[0]} (${getWeekRange(
        key
      )})`;
    case "month":
      return getMonthName(key);
    default:
      return formatDate(key);
  }
};
