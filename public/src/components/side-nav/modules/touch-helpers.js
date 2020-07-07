/**
 * @typedef {object} TouchData object that contains relevant touch data.
 * @property {number} currentX
 * @property {number} currentY
 * @property {number} startX
 * @property {number} startY
 */

/**
 * Returns direction of the ongoing touch.
 * - **-1** if touch direction is to the left;
 * - **1** if touch direction is to the right;
 * - **0** otherwise;
 *
 * @param {TouchData} touchData
 * @returns { -1 | 1 | 0 } direction of the ongoing touch.
 */
export function getTouchDirection({ startX, currentX }) {

	if (startX > currentX) return -1;
	if (startX < currentX) return 1;

	return 0;
}

/**
 * @param {TouchData} touchData
 * @returns {number[]}
 */
export function calcTouchDelta({ startX, startY, currentX, currentY }) {
	return [currentX - startX, currentY - startY];
}

/**
 * @param {TouchData} touchData
 * @returns {number} cosine of the touch angle.
 */
export function calcTouchAngle(touchData) {

	const [deltaX, deltaY] = calcTouchDelta(touchData);

	const touchVector = Math.sqrt(
		Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
	);

	return Math.abs(deltaX) / touchVector;
}