import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { useThree } from "@react-three/fiber";

type Props = {
	cameraPosition?: THREE.Vector3;
	cameraRotation?: THREE.Vector3;
};

function Bike(props: JSX.IntrinsicElements["group"] & Props) {
	const { nodes, materials } = useGLTF("/bike_v8_test.glb");
	const group = useRef<THREE.Group>(null!);

	const [spring, api] = useSpring(() => ({ rotation: [0, 0, 0], config: { mass: 5, tension: 100 } }), []);

	const { cameraPosition, cameraRotation } = props;
	const { camera } = useThree();

	useEffect(() => {
		let timeout: any;
		const rotate = () => {
			api.start({ rotation: [Math.random() * Math.PI * 3, 0, 0] });
			timeout = setTimeout(rotate, (0.5 + Math.random() * 2) * 1000);
		};
		rotate();

		if (cameraPosition) {
			camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
		}
		if (cameraRotation) {
			camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);
		}

		return () => clearTimeout(timeout);
	}, []);

	return (
		<group {...props} dispose={null}>
			<a.group name="Wheel_Front" ref={group} position={[0, 0.87, 1.44]} {...spring}>
				<mesh
					name="Hub_front"
					geometry={(nodes.Hub_front as THREE.Mesh).geometry}
					material={materials["Material.002"]}
					// position={[0, 0.87, 1.44]}
					scale={[1.54, 1, 1]}
				/>
				<mesh
					name="Spoke_1"
					geometry={(nodes.Spoke_1 as THREE.Mesh).geometry}
					material={materials["Material.002"]}
					// position={[0, 0.87, 1.44]}
					rotation={[-Math.PI, 0, 0]}
					scale={[-0.9, -1, -1]}
				/>
				<mesh
					name="Torus001"
					geometry={(nodes.Torus001 as THREE.Mesh).geometry}
					material={materials.Saddle}
					// position={[0, 0.87, 1.44]}
					rotation={[0, 0, -Math.PI / 2]}
				/>
			</a.group>
			<a.group name="Wheel_Back" ref={group} position={[0, 0.87, -1.48]} {...spring}>
				<mesh
					name="Hub_back"
					geometry={(nodes.Hub_back as THREE.Mesh).geometry}
					material={materials["Material.002"]}
					// position={[0, 0.87, -1.48]}
					scale={[1.47, 1, 1]}
				/>
				<mesh
					name="Spoke_2"
					geometry={(nodes.Spoke_2 as THREE.Mesh).geometry}
					material={materials["Material.002"]}
					// position={[0, 0.87, -1.48]}
					rotation={[-Math.PI, 0, 0]}
					scale={[-0.48, -1, -1]}
				/>
				<mesh
					name="Torus002"
					geometry={(nodes.Torus002 as THREE.Mesh).geometry}
					material={materials.Saddle}
					// position={[0, 0.87, -1.48]}
					rotation={[0, 0, -Math.PI / 2]}
				/>
			</a.group>
			<a.group name="Paddles" position={[0, 0.77, -0.31]} {...spring}>
				<mesh
					name="Crank_arm_2"
					geometry={(nodes.Crank_arm_2 as THREE.Mesh).geometry}
					material={materials["Material.002"]}
					// position={[0, 0.77, -0.31]}
					rotation={[0.29, 0, -1.54]}
					scale={0.06}
				/>
				<mesh
					name="Crank_arm_1"
					geometry={(nodes.Crank_arm_1 as THREE.Mesh).geometry}
					material={materials["Material.002"]}
					// position={[0, 0.77, -0.31]}
					rotation={[0.29, 0, 1.6]}
					scale={0.06}
				/>
				<mesh
					name="Paddle_1"
					geometry={(nodes.Paddle_1 as THREE.Mesh).geometry}
					material={materials.Saddle}
					position={[0.33, -0.37, -0.1]}
					rotation={[0, 0, 0.03]}
					scale={[0.09, 0.11, 0.07]}
				/>
				<mesh
					name="Paddle_2"
					geometry={(nodes.Paddle_2 as THREE.Mesh).geometry}
					material={materials.Saddle}
					position={[-0.33, 0.32, 0.1]}
					rotation={[-3.1, 0, -0.03]}
					scale={[-0.09, -0.11, -0.07]}
				/>
			</a.group>
			<mesh
				name="Top_Seat_tube"
				geometry={(nodes.Top_Seat_tube as THREE.Mesh).geometry}
				material={materials.Main}
			/>
			<mesh
				name="Fort_Seat_stay"
				geometry={(nodes.Fort_Seat_stay as THREE.Mesh).geometry}
				material={materials.Main}
			/>
			<mesh
				name="Stem"
				geometry={(nodes.Stem as THREE.Mesh).geometry}
				material={materials.Main}
				position={[0, 1.97, 0.74]}
			/>
			<mesh
				name="Handlebars"
				geometry={(nodes.Handlebars as THREE.Mesh).geometry}
				material={materials.Main}
				position={[0, 1.97, 0.74]}
			/>
			<mesh
				name="Seat_post"
				geometry={(nodes.Seat_post as THREE.Mesh).geometry}
				material={materials.Main}
				position={[0, 1.85, -0.64]}
			/>
			<mesh
				name="Saddle"
				geometry={(nodes.Saddle as THREE.Mesh).geometry}
				material={materials.Material}
				position={[0, 2.12, -0.66]}
				scale={[0.13, 0.13, 0.15]}
			/>
			<mesh
				name="Handles"
				geometry={(nodes.Handles as THREE.Mesh).geometry}
				material={materials.Saddle}
				position={[0, 1.97, 0.74]}
			/>
			<mesh
				name="Bottom_bracket"
				geometry={(nodes.Bottom_bracket as THREE.Mesh).geometry}
				material={materials["Material.002"]}
				position={[-0.11, 0.77, -0.31]}
				rotation={[0, 0, -Math.PI / 2]}
				scale={0.23}
			/>
			<mesh
				name="Cassette"
				geometry={(nodes.Cassette as THREE.Mesh).geometry}
				material={materials["Material.002"]}
				position={[-0.07, 0.87, -1.48]}
				rotation={[0, 0, -Math.PI / 2]}
				scale={0.15}
			/>
			<mesh
				name="Cylinder002"
				geometry={(nodes.Cylinder002 as THREE.Mesh).geometry}
				material={materials["Material.002"]}
				position={[0, 0.77, -0.31]}
				rotation={[0, 0, -Math.PI / 2]}
				scale={0.06}
			/>
			<mesh
				name="Chain"
				geometry={(nodes.Chain as THREE.Mesh).geometry}
				material={materials["Material.002"]}
				position={[-0.08, 0.87, -1.48]}
				rotation={[0, 0, -Math.PI / 2]}
				scale={0.14}
			/>
			<mesh
				name="Battery"
				geometry={(nodes.Battery as THREE.Mesh).geometry}
				material={materials.Main}
				position={[0, 1.79, 0.74]}
				rotation={[-2.14, 0, 0]}
				scale={0.06}
			/>
			<mesh name="Head_tube" geometry={(nodes.Head_tube as THREE.Mesh).geometry} material={materials.Main} />
			<mesh
				name="Fort_Seat_stay001"
				geometry={(nodes.Fort_Seat_stay001 as THREE.Mesh).geometry}
				material={materials.Main}
			/>
			<mesh
				name="Screen_body"
				geometry={(nodes.Screen_body as THREE.Mesh).geometry}
				material={materials["Material.001"]}
				position={[-0.23, 2.32, 0.89]}
				rotation={[-0.6, 0, 0]}
				scale={[0.06, 0.09, 0.09]}
			/>
			<mesh
				name="Screen_display"
				geometry={(nodes.Screen_display as THREE.Mesh).geometry}
				material={materials.Screen}
				position={[-0.23, 2.32, 0.89]}
				rotation={[-0.6, 0, 0]}
				scale={[0.06, 0.09, 0.09]}
			/>
		</group>
	);
}

useGLTF.preload("/bike_v8_test.glb");

export default Bike;
