customElements.define(
	'agent-elem',
	class extends HTMLElement {
		constructor() {
			super();

			this.div = document.createElement('div');
			this.appendChild(this.div);
			this.sick_end_time = time + params.infection_time * Math.random() * 1000;

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
			if (this.type === 'infected') this.getSick();
		}

		move(dt) {
			// Movement
			if (this.tv <= time) {
				this.tv = time + Math.random() * params.speed * 2;
				this.v *= 0.9999;
				this.v += (Math.random() - 0.5) / 50;
				this.v = Math.min(Math.max(this.v, 0.05), 1);
			}

			// Rotation
			if (this.tr <= time) {
				this.tr = time + Math.random() * params.speed * 2;
				this.r *= 0.95;
				this.r += (Math.random() - 0.5) / 10;
				this.r = Math.min(Math.max(this.r, -5.0), 0.5);
			}

			// Get movement vector
			const dx = (Math.cos(this.o) * this.v * dt * params.speed) / 1000;
			const dy = (Math.sin(this.o) * this.v * dt * params.speed) / 1000;

			// Apply movement
			this.x += dx;
			this.y += dy;

			// Apply rotation
			this.o += (this.r * params.speed * dt) / 1000;

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

			if (this.type === 'cured') contamination *= 1 - params.immunity / 100;
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

		getSick() {
			this.sick_end_time = time + params.infection_time * Math.random() * 1000;
		}

		sickness() {
			if (time > this.sick_end_time) {
				// Die
				if (Math.random() < params.mortality / 100) this.type = 'dead';
				// Cure
				else this.type = 'cured';
			}

			return this.type;
		}

		// Type attribute
		set type(val) {
			this.setAttribute('type', val);

			if (val === 'infected') this.getSick();
		}

		get type() {
			return this.getAttribute('type');
		}
	}
);
