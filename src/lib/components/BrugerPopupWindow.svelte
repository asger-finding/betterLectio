<script>
	import Avatar from '$lib/components/Avatar.svelte';
	import { get } from '$lib/js//http.js';

	export let navn = null;
	export let id = null;

	let skema = null;
	let aktivitet = null;

	get(`/skema?id=${id}`).then(data => {
		skema = data;

		skema.moduler.forEach(modul => {
			let [start] = modul.tidspunkt.split(' til ');
			start = {
				dag: start.split('/')[0].length === 1 ? `0${ start.split('/')[0]}` : start.split('/')[0],
				måned: start.split('/')[1].split('-')[0].length === 1 ? `0${ start.split('/')[1].split('-')[0]}` : start.split('/')[1].split('-')[0],
				år: start.split('-')[1].split(' ')[0],

				tidspunkt: start.split(' ')[1]
			};
			let slut = `${modul.tidspunkt.split(' ')[0] } ${ modul.tidspunkt.split(' til ')[1]}`;
			slut = {
				dag: slut.split('/')[0].length === 1 ? `0${ slut.split('/')[0]}` : slut.split('/')[0],
				måned: slut.split('/')[1].split('-')[0].length === 1 ? `0${ slut.split('/')[1].split('-')[0]}` : slut.split('/')[1].split('-')[0],
				år: slut.split('-')[1].split(' ')[0],

				tidspunkt: slut.split(' ')[1]
			};

			modul.start = new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`).getTime();
			modul.slut = new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`).getTime();
			const now = new Date().getTime();

			if (now >= modul.start && now <= modul.slut) if (modul.status !== 'aflyst') aktivitet = modul;
		});
	});

	function setActivity() {
		if (aktivitet === null) return 'Fri';
		if (!aktivitet.hold) return `Ukendt aktivitet i lokale ${ aktivitet.lokale}`;

		return `${aktivitet.hold } i lokale ${ aktivitet.lokale}`;
	}
</script>

{#if skema !== null}
	<div class="card w-96 shadow-2xl">
		<div class="card-body">
			<Avatar {id} {navn} size="w-24" />
			<h2 class="card-title whitespace-pre-line">{navn}</h2>
			{#if skema.type === 'elev'}
				<p class="whitespace-pre-line">
					<strong>Grupper:</strong>
					{#each skema.grupper as gruppe}
						<a href="/skema?id=HE{gruppe.id}" class="btn btn-primary btn-xs mr-1 mb-1">{gruppe.navn}</a>
					{/each}
				</p>
			{:else if skema.type === 'lærer'}
				<p>
					<strong>Hold:</strong>
					{#each Object.entries(skema.hold) as hold}
						<a href="/skema?id=HE{hold[1]}" class="btn btn-primary btn-xs mr-1">{hold[0]}</a>
					{/each}
				</p>
			{/if}
			<p class="whitespace-pre-line"><strong>Aktivitet: </strong>{setActivity(aktivitet)}</p>
			<div class="card-actions mt-4 justify-start">
				<a href={`/skema?id=${ id}`} class="btn btn-primary">Se skema</a>
				<div class="tooltip" data-tip="Kommer snart">
					<button class="btn btn-disabled">Send besked</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="btn btn-ghost">Indlæser <span class="loading" /></div>
{/if}
