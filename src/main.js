const str_tag = (strs, ...vals) => strs.reduce((final, str, i) => final + vals[i - 1] + str);
const html = str_tag;
const css = str_tag;

let title = 'Number of people as a function of time';

function getLocal(key) {
	return localStorage.getItem(key);
}

function setLocal(key, value) {
	localStorage.setItem(key, value);
}

function updateFPS(dt) {
	if (params.real_time) {
		const fps_change = 0.9;
		new_val = 1000 / dt;
		fps = new_val * (1 - fps_change) + fps * fps_change;

		fps_span.innerText = Math.round(fps);
	} else fps_span.innerText = '';
}

// Params
const params = {};

// Data
const data = {
	healthy: { agents: [], num: [] },
	immune: { agents: [], num: [] },
	// vaccinated: { agents: [], num: [] },
	infected: { agents: [], num: [] },
	lock_down: { num: [] }
};

// Lock down levels:
const lock_down_levels = {
	0: 1,
	1: 0.25,
	2: 0.1
};

const svg = document.querySelector('svg');

function initGraph() {
	max_infected = 0;
	max_infect_rate = 0;

	num_length_limit = params.days / num_update_interval;

	// Remove rects
	const rects = document.querySelectorAll(`svg > rect`);
	for (const rect of rects) rect.remove();

	for (const type in data) {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.classList.add(`color-${type}`);
		path.id = type;

		svg.appendChild(path);

		data[type].num.length = 0;
	}
}

function drawGraph() {
	// Limit data length
	for (const type in data) {
		if (data[type].num.length > num_length_crop + 1) {
			num_length_crop++;
		}
	}

	// Remove old rects, texts and lines from graph
	const rects = document.querySelectorAll('rect, text, line');
	for (const rect of rects) rect.remove();

	let side_border_width = 20;
	let top_border_width = 20;
	let bottom_border_width = 20;

	let graph_width = svg.clientWidth - side_border_width * 2;
	let graph_height = svg.clientHeight - bottom_border_width - top_border_width;

	if (!document.body.classList.contains('show-params')) {
		side_border_width = 300;
		top_border_width = 200;
		bottom_border_width = 200;

		graph_width = svg.clientWidth - side_border_width * 2;
		graph_height = svg.clientHeight - bottom_border_width - top_border_width;

		const axes_padding = 50;

		// Draw axes rect
		{
			const axes_rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			axes_rect.id = 'axes';
			axes_rect.setAttribute('x', side_border_width - axes_padding);
			axes_rect.setAttribute('y', top_border_width - axes_padding);
			axes_rect.setAttribute('width', graph_width + axes_padding * 2);
			axes_rect.setAttribute('height', graph_height + axes_padding * 2);

			svg.prepend(axes_rect);
		}

		// Draw step lines
		{
			// X axis with 4 steps by 0.5
			for (let i = 0; i <= 8; i++) {
				const step = i / 8;

				// Line
				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				const x1 = side_border_width + step * graph_width;
				const y1 = top_border_width + graph_height + axes_padding;
				const x2 = x1;
				const y2 = y1 + 20;

				line.setAttribute('x1', x1);
				line.setAttribute('y1', y1);
				line.setAttribute('x2', x2);
				line.setAttribute('y2', y2);

				svg.appendChild(line);

				// Text
				const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('x', x1);
				text.setAttribute('y', y2 + 40);
				text.setAttribute('text-anchor', 'middle');
				text.innerHTML = i / 2;

				svg.appendChild(text);
			}

			// Y axis with 5 steps by 200
			for (let i = 0; i <= 5; i++) {
				const step = i / 5;

				// Line
				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				const x1 = side_border_width - axes_padding;
				const y1 = top_border_width + graph_height - step * graph_height;
				const x2 = x1 - 20;
				const y2 = y1;

				line.setAttribute('x1', x1);
				line.setAttribute('y1', y1);
				line.setAttribute('x2', x2);
				line.setAttribute('y2', y2);

				svg.appendChild(line);

				// Text
				const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('x', x2 - 20);
				text.setAttribute('y', y1 + 10);
				text.setAttribute('text-anchor', 'end');
				text.innerHTML = i * 200;

				svg.appendChild(text);
			}
		}

		// Labels
		{
			// X axis label
			const label_x = document.createElementNS('http://www.w3.org/2000/svg', 'text');

			label_x.setAttribute('x', side_border_width + graph_width / 2);
			label_x.setAttribute('y', top_border_width + graph_height + axes_padding + 110);

			label_x.setAttribute('text-anchor', 'middle');
			label_x.innerHTML = 'Years';

			svg.appendChild(label_x);

			// Y axis label

			const label_y = document.createElementNS('http://www.w3.org/2000/svg', 'text');

			label_y.setAttribute('y', side_border_width - axes_padding - 145);
			label_y.setAttribute('x', -(top_border_width + graph_height / 2));

			label_y.setAttribute('text-anchor', 'middle');
			label_y.setAttribute('transform', 'rotate(-90)');
			label_y.innerHTML = 'Number of people';

			svg.appendChild(label_y);
		}

		// Title
		{
			const title_text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			title_text.id = 'title';

			title_text.setAttribute('x', side_border_width + graph_width / 2);
			title_text.setAttribute('y', side_border_width - axes_padding - 140);

			title_text.setAttribute('text-anchor', 'middle');
			title_text.innerHTML = title;

			svg.appendChild(title_text);
		}
	}

	let max = 1000;

	for (const type in data) {
		const nums = data[type].num;

		// Lock down
		if (type === 'lock_down') {
			if (params.lock_down) {
				// Draw lock down limits
				{
					const limits_rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					limits_rect.setAttribute('x', side_border_width);
					limits_rect.setAttribute('y', top_border_width + graph_height - (150 / max) * graph_height);
					limits_rect.setAttribute('width', graph_width);
					limits_rect.setAttribute('height', (50 / max) * graph_height);

					svg.prepend(limits_rect);
				}

				// Add new rects to graph
				let i = 0;
				while (i < nums.length) {
					const n = nums[i];

					if (n) {
						let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

						rect.setAttribute('x', side_border_width + (graph_width * i) / (num_length_crop - 1));
						rect.setAttribute('y', top_border_width);
						rect.setAttribute('height', graph_height);

						let rect_w = 0;

						while (i < nums.length && nums[++i]) rect_w++;

						rect_w = (graph_width * rect_w) / num_length_crop;

						rect.setAttribute('width', rect_w < 0 ? 0 : rect_w);

						svg.prepend(rect);
					}

					i++;
				}
			}
		}

		// Agents
		else {
			const path = document.querySelector(`path#${type}`);
			let d = '';

			for (const i in nums) {
				const x = (graph_width * i) / (num_length_crop - 1) + side_border_width;
				const y = top_border_width + graph_height - (graph_height * nums[i]) / max;

				d += `${i > 0 ? 'L' : 'M'} ${x} ${y} `;
			}

			path.setAttribute('d', d);
		}
	}
}

function cropData() {
	// Index of last data change
	let graph_end = 0;

	// Get last change index
	for (const type in data) {
		const num = data[type].num;
		let last_num = num.slice(-1)[0];

		for (let i = num.length - 1; i >= 0; i--) {
			if (num[i] !== last_num) {
				graph_end = Math.max(graph_end, i + 1);
				break;
			}
		}
	}

	console.log(`Keeping ${graph_end} / ${num_length_crop}`);

	// Crop graph
	const crop = () => {
		if (crop_graph && num_length_crop > graph_end) {
			// Crop graph
			num_length_crop--;

			// Crop data
			for (const type in data) {
				const num = data[type].num;
				num.length = Math.min(num_length_crop + 1, num.length);
			}

			drawGraph();
			requestAnimationFrame(crop);
		}
	};

	crop();
}

function updateGraph() {
	if (time > num_update_time) {
		num_update_time += num_update_interval * 1000;

		for (const type in data) {
			const num_val = type === 'lock_down' ? lock_down_level : data[type].agents.length;
			data[type].num.push(num_val);
		}

		const last_infected_num = data.infected.agents.length;
		max_infected = Math.max(max_infected, last_infected_num);

		if (data.infected.num.length > 1) {
			const previous_infected_num = data.infected.num[data.infected.num.length - 2];
			infected_rate = (last_infected_num - previous_infected_num) / num_update_interval;
			max_infect_rate = Math.max(max_infect_rate, infected_rate);
		}

		max_infected = Math.max(max_infected, ...data.infected.num.slice(-1));

		drawGraph();
	}
}

function updateAgents() {
	for (const type in data) {
		for (const agent of data[type].agents) {
			agent.update();
		}
	}
}

function getIndexFromDays(days) {
	return Math.floor(days / num_update_interval);
}

function getIndexFromYears(years) {
	return getIndexFromDays(years * 365);
}

function getDataFromDays(type, start, end) {
	// Interval
	if (end) {
		const start_index = getIndexFromDays(start);
		const end_index = getIndexFromDays(end);

		return data[type].num.slice(start_index, end_index);
	}

	// Single value
	else return data[type].num[getIndexFromDays(start)];
}

function getDataFromYears(type, start, end) {
	return getDataFromDays(type, start * 365, end ? end * 365 : undefined);
}

// Draw graph again on window resize
window.onresize = drawGraph;

const num_update_interval = 4;

const default_dt = 32;
const ticks_per_loop = 200;

const lock_down_min_duration = 14;

let log_time = 0;
let start_time = 0;
let time_limit = 0;
let num_update_time = 0;
let num_length_limit = 0;
let num_length_crop = 0;

let stop_loop = false;
let crop_graph = false;

let infected_rate = 0;
let max_infect_rate = 0;
let max_infected = 0;
let total_infected = 0;

let lock_down_level = 0;
let lock_down_start = 0;
let lock_down_end = 0;

// Get params from localStorage and set them to inputs
for (const input of document.querySelectorAll('input')) {
	const type = input.id;
	const local_val = getLocal(type);
	const input_val = input.type === 'checkbox' ? input.checked : parseInt(input.value);

	// Input default value
	if (local_val === null) {
		params[type] = input_val;
	}

	// Local storage value
	else {
		input.value = local_val;
		input.checked = local_val === 'true';
		params[type] = local_val;
	}

	// Click start button on enter
	input.onkeydown = e => {
		if (e.key === 'Enter') {
			document.querySelector('a#start.btn').click();
		}
	};
}

// Game div
const game_div = document.querySelector('div.game');

// FPS span
const fps_span = document.querySelector('span#fps');

// Start btn click
document.querySelector('a#start.btn').onclick = async e => {
	e.preventDefault();
	// console.clear();

	stop_loop = true;
	crop_graph = false;

	setTimeout(() => {
		stop_loop = false;
		crop_graph = true;

		// Get params from inputs and save them to localStorage
		for (const key in params) {
			const input = document.querySelector(`input#${key}`);
			params[key] = input.type === 'checkbox' ? input.checked : parseInt(input.value);
			setLocal(key, params[key]);
		}

		// Init game
		let game_html = '';

		for (const type in data) {
			if (type !== 'lock_down') {
				for (let i = 0; i < params[type]; i++) {
					game_html += html`<agent-elem type="${type}"></agent-elem>`;
				}
			}
		}

		game_div.innerHTML = game_html;

		initGraph();
		num_length_crop = num_length_limit;
		lock_down_level = 0;
		infected_rate = 0;
		total_infected = 0;

		// Start loop
		requestAnimationFrame(loop);
	}, 500);

	setTimeout(() => {
		document.body.classList.add('running');
	}, 1000);
};

// Stop btn click
document.querySelector('a#stop.btn').onclick = e => {
	e.preventDefault();
	document.body.classList.remove('running');
	stop_loop = true;
	crop_graph = true;
};

// Keep graph btn click
document.querySelector('a#keep.btn').onclick = e => {
	e.preventDefault();

	// SVG not empty
	if (svg.children.length > 0) {
		// Save content as group
		svg.innerHTML = html`<g class="keep">${svg.innerHTML}</g>`;

		// Remove path ids
		for (const path of svg.querySelectorAll('path')) {
			path.id = '';
		}
	}
};

// Crop graph btn click
document.querySelector('a#crop.btn').onclick = e => {
	e.preventDefault();
	cropData();
};

// Reset params btn click
document.querySelector('a#reset.btn').onclick = e => {
	e.preventDefault();

	// Get all keys from localStorage
	const keys = Object.keys(localStorage);

	// Remove all keys
	for (const key of keys) {
		localStorage.removeItem(key);
	}

	// Reload page
	location.reload();
};

document.querySelector('section.bottom').onclick = e => {
	e.preventDefault();
	if (!document.body.classList.toggle('show-params')) {
		drawGraph('coucou');
	} else {
		drawGraph();
	}
};

let time = 0;
let fps = 30;

async function loop(t) {
	// Real time simulation
	if (params.real_time) {
		const dt = Math.min(Math.max(15, t - time), 100);
		time = t;

		if (time_limit === 0) {
			time_limit = time + params.days * 1000;
			num_update_time = time;
			start_time = new Date().getTime();
		}

		// Tick
		if (t > 0) {
			tick(dt);
			updateAgents();
		}
	}

	// Fixed time simulation
	else {
		// On start
		if (time_limit === 0) {
			time = 0;
			time_limit = params.days * 1000;
			num_update_time = 0;
			start_time = new Date().getTime();
		}

		const dt = default_dt;

		// Tick
		for (let i = 0; i < ticks_per_loop; i++) {
			time += dt;
			tick(dt);
		}

		updateAgents();
	}

	// Stop loop
	if (stop_loop || time >= time_limit) finish();
	// Request next frame
	else requestAnimationFrame(loop);
}

function tick(dt) {
	updateFPS(dt);

	// Lock down
	if (!lock_down_level && data.infected.agents.length > 150) {
		lock_down_level = params.lock_down;
		lock_down_start = time;
	} else {
		const can_end = time >= lock_down_start + lock_down_min_duration * 1000;

		if (can_end && data.infected.agents.length <= 100) {
			lock_down_level = 0;
			lock_down_start = time;
		}
	}

	// Upadate data
	for (const type in data) {
		data[type].agents = game_div.querySelectorAll(`agent-elem[type="${type}"]`);
	}

	for (const type of ['healthy', 'vaccinated']) {
		if (data[type]) {
			for (const agent of data[type].agents) {
				agent.move(dt);

				// Infection of healthy and vaccinated agents
				if (data.infected.agents.length && agent.vulnerable(dt) && agent.contact(data.infected.agents)) {
					agent.type = 'infected';
					total_infected++;
				}

				// // Vaccination of healthy agents
				else if (type === 'healthy' && agent.vaccinable(dt)) {
					agent.type = 'vaccinated';
				}

				// Effects of vaccine
				else if (type === 'vaccinated') agent.vaccine();
			}
		}
	}

	for (const agent of data.immune.agents) {
		agent.move(dt);
		agent.immunity();
	}

	for (const agent of data.infected.agents) {
		agent.move(dt);

		// Effects of infection
		agent.sickness(dt);
	}

	updateGraph();
}

function finish() {
	document.body.classList.remove('running');
	time_limit = 0;

	console.log(`Finished in ${((new Date().getTime() - start_time) / 1000).toFixed(2)}s / ${params.days}s`);
}

// Click start btn
document.querySelector('a#start.btn').click();
