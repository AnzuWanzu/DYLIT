import Task from "../models/Task.js";

export const MAX_DAILY_HOURS = 8;

/**
 * Validate basic task input fields
 * @param {string} title
 * @param {string} description
 * @param {number} hours
 * @returns {Object}
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

  if (!hours || isNaN(hours) || Number(hours) <= 0) {
    errors.push("Valid hours worked is required");
  }

  if (Number(hours) > MAX_DAILY_HOURS) {
    errors.push(`Hours cannot exceed ${MAX_DAILY_HOURS} for a single task`);
  }

  if (Number(hours) > 0 && Number(hours) < 0.1) {
    errors.push("Minimum task duration is 0.1 hours (6 minutes)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate total hours from an array of tasks
 * @param {Array} tasks
 * @returns {number}
 */
export const calculateTotalHours = (tasks = []) => {
  return tasks.reduce((total, task) => total + (task.hours || 0), 0);
};

/**
 * Validate if adding/updating hours would exceed the 8-hour daily limit
 * @param {number} newHours
 * @param {string} dayId
 * @param {string} userId
 * @param {string|null} excludeTaskId
 * @returns {Promise<Object>}
 */
export const validateDailyHoursLimit = async (
  newHours,
  dayId,
  userId,
  excludeTaskId = null
) => {
  try {
    const query = {
      day: dayId,
      user: userId,
    };

    if (excludeTaskId) {
      query._id = { $ne: excludeTaskId };
    }

    const existingTasks = await Task.find(query);
    const currentTotal = calculateTotalHours(existingTasks);
    const newTotal = currentTotal + Number(newHours);

    return {
      isValid: newTotal <= MAX_DAILY_HOURS,
      currentTotal: Math.round(currentTotal * 10) / 10, // Round to 1 decimal
      newTotal: Math.round(newTotal * 10) / 10,
      remainingHours: Math.max(
        0,
        Math.round((MAX_DAILY_HOURS - currentTotal) * 10) / 10
      ),
      maxHours: MAX_DAILY_HOURS,
    };
  } catch (error) {
    console.error("Error validating daily hours limit:", error);
    return {
      isValid: false,
      error: "Failed to validate hours limit",
    };
  }
};

/**
 * Get validation error message for hours limit exceeded
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
  return `Cannot ${action} ${requestedHours} hours. Total would be ${newTotal} hours, exceeding the ${MAX_DAILY_HOURS}-hour work day limit. You have ${remainingHours} hours remaining.`;
};

/**
 * Validate task hours for a specific range
 * @param {number} hours
 * @param {number} min
 * @param {number} max
 * @returns {Object}
 */
export const validateHoursRange = (hours, min = 0.1, max = MAX_DAILY_HOURS) => {
  const numHours = Number(hours);

  if (isNaN(numHours)) {
    return {
      isValid: false,
      error: "Hours must be a valid number",
    };
  }

  if (numHours < min) {
    return {
      isValid: false,
      error: `Hours cannot be less than ${min}`,
    };
  }

  if (numHours > max) {
    return {
      isValid: false,
      error: `Hours cannot exceed ${max}`,
    };
  }

  return {
    isValid: true,
  };
};

/**
 * Get progress information for daily hours
 * @param {number} currentHours
 * @returns {Object}
 */
export const getDailyHoursProgress = (currentHours) => {
  const percentage = Math.min((currentHours / MAX_DAILY_HOURS) * 100, 100);

  return {
    percentage: Math.round(percentage),
    status: getHoursStatus(currentHours),
    remainingHours: Math.max(
      0,
      Math.round((MAX_DAILY_HOURS - currentHours) * 10) / 10
    ),
    isOverLimit: currentHours > MAX_DAILY_HOURS,
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
 * Validate multiple tasks for daily hours limit
 * @param {Array} tasks
 * @returns {Object}
 */
export const validateMultipleTasks = (tasks) => {
  const totalHours = calculateTotalHours(tasks);

  return {
    isValid: totalHours <= MAX_DAILY_HOURS,
    totalHours: Math.round(totalHours * 10) / 10,
    maxHours: MAX_DAILY_HOURS,
    remainingHours: Math.max(
      0,
      Math.round((MAX_DAILY_HOURS - totalHours) * 10) / 10
    ),
    tasksCount: tasks.length,
  };
};
