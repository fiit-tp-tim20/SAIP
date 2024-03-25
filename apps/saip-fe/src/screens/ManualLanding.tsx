import React from "react";
import { useLocation } from "react-router";
// import YouTube from "react-youtube";
import LinkTab from "../components/navbar/LinkTab";
import { Link } from 'react-router-dom';

function ManualLanding() {
	const location = useLocation();
	const tabs = [

        {
			title: "Domov",
			path: "/",
		},
		{
			title: "Prihlásenie",
			path: "/login",
		},
		{
			title: "Registrácia",
			path: "/register",
		},
	];
	console.log(location)

	const onButtonClick = () => {

        fetch("public/SamplePDF.pdf").then((response) => {
            response.blob().then((blob) => {

                // Creating new object of PDF file
                const fileURL =
                    window.URL.createObjectURL(blob);

                // Setting various property values
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = "SamplePDF.pdf";
                alink.click();
            });
        });
    };

	return (
		<div className="flex">
			<div className="flex flex-row w-screen fixed top-0 left-0 z-40 navbar-bg">
				<p className="px-10 py-4 text-3xl align-middle font-bold accent-800-color leading-[20px]">SAIP</p>
				<div className="flex flex-row items-center justify-end w-screen">
					<ul className="flex flex-row p-0 m-0">
						{tabs.map((tab) => (
							<LinkTab
								key={tab.path}
								title={tab.title}
								path={tab.path}
								isActive={tab.path === location.pathname}
							/>
						))}
					</ul>
				</div>
			</div>
			<div className="flex flex-row p-14 top-20 w-screen left-0 z-2 navbar-bg">
				<div className=" w-2/4 mx-8 my-4 custombounce">
					<h2>SAIP Príručka</h2>
					<p>
						<b>Jožko Mrkvička</b><br/>
						email: Jožko.Mrkvička@gmail.com<br/>
						Ústav manažmentu STU <br/>
						Vazovova 5, 812 43 Bratislava <br/>
						<b>DOI:</b> <a href={"https://doi.org/10.61544/mnk/JOZW8037"} style={{ color: 'blue', textDecoration: 'underline' }}>tmp</a> <br/>
					</p>
				</div>
				<div className="w-2/4 mx-8 my-4 custom-bounce">
					<h2>Informácie</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rutrum et nulla sed sodales. Sed elit magna, gravida et cursus vel, consequat ac arcu. Vestibulum suscipit elit eu felis tristique cursus. Pellentesque sagittis felis ac ipsum tempus, vulputate suscipit nulla iaculis. Nunc consequat finibus nisi. Sed finibus turpis ac turpis laoreet iaculis. Morbi vestibulum ante in turpis auctor convallis. Donec nunc elit, pretium sit amet laoreet ac, placerat at sapien. Suspendisse potenti. Fusce neque nibh, pharetra posuere maximus pharetra, elementum sit amet ligula. <br/>
					</p>
					<button
						type="button"
						className="button-dark font-bold py-2 px-4 m-0 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={onButtonClick}
					>
						Stiahnuť PDF
					</button>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-3 py-1 border-t-2 border-accent-700">
				<div className="container mx-auto flex flex-row items-center justify-between">
					<p className="text-center font-medium">Rozpočet:</p>
					<div className="flex gap-8">
						<button type="button" className="button-clear">
							<p placeholder={"mail"}> meno@gmail.com</p>
						</button>
						<button type="button" className="button-clear">
							Pomoc
						</button>
						<button type="button" className="button-clear">

						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ManualLanding;