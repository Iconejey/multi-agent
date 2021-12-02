customElements.define(
	'agent-elem',
	class extends HTMLElement {
		constructor() {
			super();

			this.div = document.createElement('div');
			this.appendChild(this.div);
			this.sick_end_time = 0;
			this.immune_end_time = 0;
			this.vaccine_end_time = 0;

			// Position
			this.x = (Math.random() * game_div.clientWidth) / 16;
			this.y = (Math.random() * game_div.clientHeight) / 16;

			// Orientation
			this.o = Math.random() * Math.PI * 2;

			// Movement
			this.v = Math.random() * 0.2;
			this.tv = 0;

			// Rotation
			this.r = 0;
			this.tr = 0;

			// Size
			this.size = params.size / 100;
			this.div.style.width = this.size + 'em';
			this.div.style.height = this.size + 'em';

			this.move(1);
			if (this.type === 'infected') this.getInfected();
			if (this.type === 'immune') this.getImmune();
		}

		move(dt) {
			const speed = params.speed * lock_down_levels[lock_down_level];

			// Movement
			if (this.tv <= time) {
				this.tv = time + Math.random() * speed * 2;
				this.v *= 0.9999;
				this.v += (Math.random() - 0.5) / 50;
				this.v = Math.min(Math.max(this.v, 0.05), 1);
			}

			// Rotation
			if (this.tr <= time) {
				this.tr = time + Math.random() * speed * 2;
				this.r *= 0.95;
				this.r += (Math.random() - 0.5) / 10;
				this.r = Math.min(Math.max(this.r, -5.0), 0.5);
			}

			// Get movement vector
			const dx = (Math.cos(this.o) * this.v * dt * speed) / 1000;
			const dy = (Math.sin(this.o) * this.v * dt * speed) / 1000;

			// Apply movement
			this.x += dx;
			this.y += dy;

			// Apply rotation
			this.o += (this.r * speed * dt) / 1000;

			const border = this.size / 2;
			const border2 = game_div.clientWidth / 16 - border;
			let hit = false;

			// Bounce on left border
			if (this.x < border) {
				this.x = border;
				this.o = Math.PI - this.o;
				hit = true;
			}

			// Bounce on right border
			if (this.x > border2) {
				this.x = border2;
				this.o = Math.PI - this.o;
				hit = true;
			}

			// Bounce on top border
			if (this.y < border) {
				this.y = border;
				this.o = -this.o;
				hit = true;
			}

			// Bounce on bottom border
			if (this.y > game_div.clientHeight / 16 - border) {
				this.y = game_div.clientHeight / 16 - border;
				this.o = -this.o;
				hit = true;
			}

			if (hit) this.r = 0;
		}

		update() {
			// Update style
			this.div.style.transform = `translate(calc(${this.x}em - 50%), calc(${this.y}em - 50%))`;
		}

		vulnerable(dt) {
			let contamination = params.contamination / 100;
			if (this.type === 'vaccinated') contamination *= 1 - params.vaccine / 100;

			return Math.random() < (contamination * dt) / 1000;
		}

		touch(agent) {
			const dx = this.x - agent.x;
			const dy = this.y - agent.y;
			const d = Math.sqrt(dx * dx + dy * dy);

			return d < this.size;
		}

		contact(infected_agents) {
			for (const agent of infected_agents) {
				if (this.touch(agent)) return true;
			}

			return false;
		}

		getInfected() {
			const margin = (params.infection_time_2 - params.infection_time_1) * Math.random();
			const days = params.infection_time_1 + margin;
			this.sick_end_time = time + days * 1000;
		}

		sickness() {
			if (time > this.sick_end_time) {
				this.type = 'immune';
			}
		}

		getImmune() {
			const margin = (params.immunity_time_2 - params.immunity_time_1) * Math.random();
			const days = params.immunity_time_1 + margin;
			this.immune_end_time = time + days * 1000;
		}

		immunity() {
			if (time > this.immune_end_time) this.type = 'healthy';
		}

		getVacined() {
			const margin = (params.vaccine_time_2 - params.vaccine_time_1) * Math.random();
			const days = params.vaccine_time_1 + margin;
			this.vaccine_end_time = time + days * 1000;
		}

		vaccinable(dt) {
			const vaccine_start_time = params.vaccine_date * 1000;
			return time >= vaccine_start_time && Math.random() < (params.vaccination_rate / 100) * (dt / 7000);
		}

		vaccine() {
			if (time > this.vaccine_end_time) this.type = 'healthy';
		}

		// Type attribute
		set type(val) {
			this.setAttribute('type', val);

			if (val === 'infected') this.getInfected();
			if (val === 'immune') this.getImmune();
			if (val === 'vaccinated') this.getVacined();
		}

		get type() {
			return this.getAttribute('type');
		}
	}
);
