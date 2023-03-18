import React from "react";
import { useTranslation } from "react-i18next";
import Slider from "../components/slider/Slider";
import useMarketingStore from "../store/Marketing";

function Marketing() {
	const { t } = useTranslation();
	const {
		viral,
		viralChecked,
		ooh,
		oohChecked,
		billboard,
		billboardChecked,
		tv,
		tvChecked,
		podcast,
		podcastChecked,
		setViral,
		setViralChecked,
		setOoh,
		setOohChecked,
		setBillboard,
		setBillboardChecked,
		setTv,
		setTvChecked,
		setPodcast,
		setPodcastChecked,
	} = useMarketingStore();

	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<h1 className="my-4">Štatistiky</h1>
			<div className="grid gap-6 xl:grid-cols-3">
				<div className="background-container flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2 className="text-accent-700">Placeholder</h2>
					</div>
				</div>

				<div className="background-container flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2 className="text-accent-700">Placeholder</h2>
					</div>
				</div>

				<div className="background-container flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2 className="text-accent-700">Placeholder</h2>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<h1 className="my-4">Typy marketingu</h1>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>Virálny marketing</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={4000}
								value={viral}
								setValue={setViral}
								checked={viralChecked}
								setChecked={setViralChecked}
								step={10}
								requiredMin={100}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>OOH</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={4000}
								value={ooh}
								setValue={setOoh}
								checked={oohChecked}
								setChecked={setOohChecked}
								step={10}
								requiredMin={500}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>Billboardy</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={4000}
								value={billboard}
								setValue={setBillboard}
								checked={billboardChecked}
								setChecked={setBillboardChecked}
								step={10}
								requiredMin={500}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>Televízia</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={4000}
								value={tv}
								setValue={setTv}
								checked={tvChecked}
								setChecked={setTvChecked}
								step={10}
								requiredMin={2000}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>Podcasty</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={4000}
								value={podcast}
								setValue={setPodcast}
								checked={podcastChecked}
								setChecked={setPodcastChecked}
								step={10}
								requiredMin={1000}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Marketing;
