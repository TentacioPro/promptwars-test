/**
 * Standardized JSON response helpers.
 * Ensures consistent response shape across all endpoints.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data - Response payload
 * @param {number} [statusCode=200]
 */
export function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Send a created response (201).
 * @param {import('express').Response} res
 * @param {*} data - Newly created resource
 */
export function created(res, data) {
  return success(res, data, 201);
}

/**
 * Send a paginated success response.
 * @param {import('express').Response} res
 * @param {Array} items - Array of items
 * @param {object} pagination - { total, limit, offset }
 */
export function paginated(res, items, pagination) {
  return res.status(200).json({
    success: true,
    data: items,
    pagination,
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Error message
 * @param {number} [statusCode=400]
 * @param {*} [details] - Optional error details
 */
export function error(res, message, statusCode = 400, details = null) {
  const body = {
    success: false,
    error: message,
  };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}

/**
 * Send a 404 Not Found response.
 * @param {import('express').Response} res
 * @param {string} [resource='Resource']
 */
export function notFound(res, resource = 'Resource') {
  return error(res, `${resource} not found`, 404);
}
