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
		<div className="flex flex-col xl:w-[1280px] md:w-[900px] w-[600px]">
			<h1 className="my-4">Štatistiky</h1>
			<div className="grid xl:grid-cols-3 gap-6">
				<div className="flex flex-col background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2 className="text-accent-700">Placeholder</h2>
					</div>
				</div>

				<div className="flex flex-col background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2 className="text-accent-700">Placeholder</h2>
					</div>
				</div>

				<div className="flex flex-col background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2 className="text-accent-700">Placeholder</h2>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<h1 className="my-4">Typy marketingu</h1>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Virálny marketing</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={10000}
								value={viral}
								setValue={setViral}
								checked={viralChecked}
								setChecked={setViralChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>OOH</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={1000}
								value={ooh}
								setValue={setOoh}
								checked={oohChecked}
								setChecked={setOohChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Billboardy</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={1000}
								value={billboard}
								setValue={setBillboard}
								checked={billboardChecked}
								setChecked={setBillboardChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Televízia</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={1000}
								value={tv}
								setValue={setTv}
								checked={tvChecked}
								setChecked={setTvChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Podcasty</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={1000}
								value={podcast}
								setValue={setPodcast}
								checked={podcastChecked}
								setChecked={setPodcastChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Marketing;
