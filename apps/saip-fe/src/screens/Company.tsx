import React from "react";
import Slider from "../components/slider/Slider";

function Company() {
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
				<h1 className="my-4">Rozdelenie financií</h1>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Počet produkovaných kusov</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Počet kusov</h3>
						<div>
							<Slider min={0} max={1000} step={10} />
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Cena za kus</h2>
					</div>
					<p className="pt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur natus non distinctio
						voluptas velit, officiis amet! Modi doloribus aspernatur natus aut vitae! Vel recusandae
						corrupti eum minus dolores. Eos in tempora eligendi pariatur earum? Aliquam ipsa recusandae
						incidunt impedit ex nam similique possimus. Perferendis quo molestias libero quidem, at tempore!
						Incidunt aliquid labore voluptatem.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Predajná cena</h3>
						<div>
							<Slider min={0} max={1000} step={10} />
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Investície do kapitálu</h2>
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
							<Slider min={0} max={1000} step={10} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Company;
