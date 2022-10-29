import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh, Vector3 } from "three";

function Bike() {
	const { nodes } = useGLTF("/bike_test.glb");

	const upgradeRef = useRef<Mesh>(null!);

	// hide upgradeRef.current after 5 seconds
	useEffect(() => {
		console.warn(nodes);
		console.warn(upgradeRef.current);
		console.log(upgradeRef.current.parent?.children);
		let isVisible = upgradeRef.current.visible;
		setInterval(() => {
			upgradeRef.current.visible = !isVisible;
			isVisible = !isVisible;
		}, 1000);
	}, []);

	return (
		<>
			<mesh scale={[2, 2, 2]} geometry={nodes.Bike.geometry}>
				<meshToonMaterial attach="material" color="gray" />
			</mesh>
			<mesh scale={[2, 2, 2]} geometry={nodes.Upgrade_1.geometry} ref={upgradeRef}>
				<meshToonMaterial attach="material" color="hotpink" />
			</mesh>
			<mesh scale={[2, 2, 2]} geometry={nodes.test_cube.geometry}>
				<meshToonMaterial attach="material" color="hotpink" />
			</mesh>
		</>
	);
}

export default Bike;
