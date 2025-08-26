/**
 * Frontend validator utilities for task management
 * Works in conjunction with backend validation
 */

// Match backend limit
export const MAX_DAILY_HOURS = 8;

/**
 * Validate task input on the frontend
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string|number} hours - Task hours
 * @returns {Object} Validation result
 */
export const validateTaskInput = (title, description, hours) => {
  const errors = [];

  if (!title || !title.trim()) {
    errors.push("Task title is required");
  }

  if (title && title.trim().length > 100) {
    errors.push("Task title cannot exceed 100 characters");
  }

  if (!description || !description.trim()) {
    errors.push("Task description is required");
  }

  if (description && description.trim().length > 500) {
    errors.push("Task description cannot exceed 500 characters");
  }

  const numHours = Number(hours);
  if (!hours || isNaN(numHours) || numHours <= 0) {
    errors.push("Valid hours worked is required");
  }

  if (numHours > MAX_DAILY_HOURS) {
    errors.push(`Hours cannot exceed ${MAX_DAILY_HOURS} for a single task`);
  }

  if (numHours > 0 && numHours < 0.1) {
    errors.push("Minimum task duration is 0.1 hours (6 minutes)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate total hours from task array
 * @param {Array} tasks
 * @returns {number}
 */
export const calculateTotalHours = (tasks = []) => {
  return tasks.reduce((total, task) => total + (task.hours || 0), 0);
};

/**
 * Check if adding hours would exceed daily limit (client-side preview)
 * @param {Array} existingTasks
 * @param {number} newHours
 * @param {string} excludeTaskId
 * @returns {Object}
 */
export const checkDailyHoursLimit = (
  existingTasks = [],
  newHours,
  excludeTaskId = null
) => {
  const tasksToCount = excludeTaskId
    ? existingTasks.filter((task) => task._id !== excludeTaskId)
    : existingTasks;

  const currentTotal = calculateTotalHours(tasksToCount);
  const newTotal = currentTotal + Number(newHours);

  return {
    isValid: newTotal <= MAX_DAILY_HOURS,
    currentTotal: Math.round(currentTotal * 10) / 10,
    newTotal: Math.round(newTotal * 10) / 10,
    remainingHours: Math.max(
      0,
      Math.round((MAX_DAILY_HOURS - currentTotal) * 10) / 10
    ),
    maxHours: MAX_DAILY_HOURS,
  };
};

/**
 * Get progress information for daily hours with visual indicators
 * @param {number} currentHours
 * @returns {Object}
 */
export const getDailyHoursProgress = (currentHours) => {
  const percentage = Math.min((currentHours / MAX_DAILY_HOURS) * 100, 100);
  const status = getHoursStatus(currentHours);

  const statusConfig = {
    low: {
      color: "text-success",
      bgColor: "bg-success/20",
      progressColor: "progress-success",
      badge: "badge-success",
    },
    normal: {
      color: "text-info",
      bgColor: "bg-info/20",
      progressColor: "progress-info",
      badge: "badge-info",
    },
    high: {
      color: "text-warning",
      bgColor: "bg-warning/20",
      progressColor: "progress-warning",
      badge: "badge-warning",
    },
    over: {
      color: "text-error",
      bgColor: "bg-error/20",
      progressColor: "progress-error",
      badge: "badge-error",
    },
  };

  return {
    percentage: Math.round(percentage),
    status,
    remainingHours: Math.max(
      0,
      Math.round((MAX_DAILY_HOURS - currentHours) * 10) / 10
    ),
    isOverLimit: currentHours > MAX_DAILY_HOURS,
    styling: statusConfig[status],
    statusText: getStatusText(status, currentHours),
  };
};

/**
 * Get status based on hours worked
 * @param {number} hours
 * @returns {string}
 */
export const getHoursStatus = (hours) => {
  if (hours > MAX_DAILY_HOURS) return "over";
  if (hours > MAX_DAILY_HOURS * 0.875) return "high";
  if (hours > MAX_DAILY_HOURS * 0.625) return "normal";
  return "low"; // <= 5 hours
};

/**
 * Get human-readable status text
 * @param {string} status
 * @param {number} hours
 * @returns {string}
 */
export const getStatusText = (status, hours) => {
  switch (status) {
    case "low":
      return "Good start!";
    case "normal":
      return "Making progress";
    case "high":
      return "Almost full day";
    case "over":
      return `Over limit by ${
        Math.round((hours - MAX_DAILY_HOURS) * 10) / 10
      }h`;
    default:
      return "";
  }
};

/**
 * Format hours display with appropriate precision
 * @param {number} hours
 * @returns {string}
 */
export const formatHours = (hours) => {
  const rounded = Math.round(hours * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
};

/**
 * Get hours limit error message for frontend display
 * @param {number} requestedHours
 * @param {number} newTotal
 * @param {number} remainingHours
 * @param {boolean} isUpdate
 * @returns {string}
 */
export const getHoursLimitErrorMessage = (
  requestedHours,
  newTotal,
  remainingHours,
  isUpdate = false
) => {
  const action = isUpdate ? "update to" : "add";
  return `Cannot ${action} ${formatHours(
    requestedHours
  )} hours. Total would be ${formatHours(
    newTotal
  )} hours, exceeding the ${MAX_DAILY_HOURS}-hour work day limit. You have ${formatHours(
    remainingHours
  )} hours remaining.`;
};

/**
 * Validate hours input with user-friendly messages
 * @param {string|number} hours
 * @returns {Object}
 */
export const validateHoursInput = (hours) => {
  const numHours = Number(hours);

  if (!hours || hours === "") {
    return {
      isValid: false,
      error: "Hours worked is required",
    };
  }

  if (isNaN(numHours)) {
    return {
      isValid: false,
      error: "Please enter a valid number",
    };
  }

  if (numHours <= 0) {
    return {
      isValid: false,
      error: "Hours must be greater than 0",
    };
  }

  if (numHours < 0.1) {
    return {
      isValid: false,
      error: "Minimum duration is 0.1 hours (6 minutes)",
    };
  }

  if (numHours > MAX_DAILY_HOURS) {
    return {
      isValid: false,
      error: `Cannot exceed ${MAX_DAILY_HOURS} hours per task`,
    };
  }

  return {
    isValid: true,
  };
};
