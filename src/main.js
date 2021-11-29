const str_tag = (strs, ...vals) => strs.reduce((final, str, i) => final + vals[i - 1] + str);
const html = str_tag;
const css = str_tag;

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

const params = {};

// Data
const data = {
	healthy: { agents: [], num: [] },
	infected: { agents: [], num: [] },
	// vaccinated: { agents: [], num: [] },
	cured: { agents: [], num: [] }
	// dead: { agents: [], num: [] }
};

const svg = document.querySelector('svg');

function initGraph() {
	num_length_limit = params.days / num_update_interval;

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

	// Borders
	const border_width = 4;

	const w = svg.clientWidth - border_width * 2;
	const h = svg.clientHeight - border_width * 2;

	let population = 0;
	let max = 0;

	// Get max num and population
	for (const type in data) {
		max = Math.max(max, ...data[type].num);
		population += data[type].agents.length;
	}

	for (const type in data) {
		const path = document.querySelector(`path#${type}`);
		const nums = data[type].num;
		let d = '';

		for (const i in nums) {
			const x = (w * i) / (num_length_crop - 1) + border_width;
			const y = h - (h * nums[i]) / max + border_width;

			d += `${i > 0 ? 'L' : 'M'} ${x} ${y} `;
		}

		path.setAttribute('d', d);
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
			data[type].num.push(data[type].agents.length);
		}

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

// Draw graph again on window resize
window.onresize = drawGraph;

const num_update_interval = 1;

const default_dt = 32;
const ticks_per_loop = 100;
const log_interval = 1;

let log_time = 0;
let start_time = 0;
let time_limit = 0;
let num_update_time = 0;
let num_length_limit = 0;
let num_length_crop = 0;

let stop_loop = false;
let crop_graph = false;

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

	document.body.classList.add('running');

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
			for (let i = 0; i < params[type]; i++) {
				game_html += html`<agent-elem type="${type}"></agent-elem>`;
			}
		}

		game_div.innerHTML = game_html;

		initGraph();
		num_length_crop = num_length_limit;

		// Start loop
		requestAnimationFrame(loop);
	}, 500);
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

	// Upadate data
	for (const type in data) {
		data[type].agents = game_div.querySelectorAll(`agent-elem[type="${type}"]`);
	}

	for (const type of ['healthy', 'cured', 'vaccinated']) {
		for (const agent of data[type].agents) {
			agent.move(dt);

			if (data.infected.agents.length && agent.vulnerable(dt) && agent.contact(data.infected.agents)) {
				agent.type = 'infected';
			}
		}
	}

	for (const agent of data.infected.agents) {
		agent.move(dt);
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
