import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, Euler, Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

// TODO remove after model completion
type Props = {
	path: string;
};

function Bike(props: Props) {
	const { nodes } = useGLTF("/bike_test.glb");
	const { nodes: nodes2 } = useGLTF(props.path);

	// console.log(props.path, nodes2);

	const spokeRef1 = useRef<Mesh>(null!);
	const spokeRef2 = useRef<Mesh>(null!);

	return (
		<>
			<mesh
				scale={nodes2.Battery.scale}
				geometry={nodes2.Battery.geometry}
				position={nodes2.Battery.position}
				rotation={nodes2.Battery.rotation}
				material={nodes2.Battery.material}
				name={nodes2.Battery.name}
			/>
			<mesh
				scale={nodes2.Bottom_bracket.scale}
				geometry={nodes2.Bottom_bracket.geometry}
				position={nodes2.Bottom_bracket.position}
				rotation={nodes2.Bottom_bracket.rotation}
				material={nodes2.Bottom_bracket.material}
				name={nodes2.Bottom_bracket.name}
			/>
			<mesh
				scale={nodes2.Cassette.scale}
				geometry={nodes2.Cassette.geometry}
				position={nodes2.Cassette.position}
				rotation={nodes2.Cassette.rotation}
				material={nodes2.Cassette.material}
				name={nodes2.Cassette.name}
			/>
			<mesh
				scale={nodes2.Chain.scale}
				geometry={nodes2.Chain.geometry}
				position={nodes2.Chain.position}
				rotation={nodes2.Chain.rotation}
				material={nodes2.Chain.material}
				name={nodes2.Chain.name}
			/>
			<mesh
				scale={nodes2.Crank_arm_1.scale}
				geometry={nodes2.Crank_arm_1.geometry}
				position={nodes2.Crank_arm_1.position}
				rotation={nodes2.Crank_arm_1.rotation}
				material={nodes2.Crank_arm_1.material}
				name={nodes2.Crank_arm_1.name}
			/>
			<mesh
				scale={nodes2.Crank_arm_2.scale}
				geometry={nodes2.Crank_arm_2.geometry}
				position={nodes2.Crank_arm_2.position}
				rotation={nodes2.Crank_arm_2.rotation}
				material={nodes2.Crank_arm_2.material}
				name={nodes2.Crank_arm_2.name}
			/>
			<mesh
				scale={nodes2.Cylinder002.scale}
				geometry={nodes2.Cylinder002.geometry}
				position={nodes2.Cylinder002.position}
				rotation={nodes2.Cylinder002.rotation}
				material={nodes2.Cylinder002.material}
				name={nodes2.Cylinder002.name}
			/>
			<mesh
				scale={nodes2.Fort_Seat_stay.scale}
				geometry={nodes2.Fort_Seat_stay.geometry}
				position={nodes2.Fort_Seat_stay.position}
				rotation={nodes2.Fort_Seat_stay.rotation}
				material={nodes2.Fort_Seat_stay.material}
				name={nodes2.Fort_Seat_stay.name}
			/>
			<mesh
				scale={nodes2.Fort_Seat_stay001.scale}
				geometry={nodes2.Fort_Seat_stay001.geometry}
				position={nodes2.Fort_Seat_stay001.position}
				rotation={nodes2.Fort_Seat_stay001.rotation}
				material={nodes2.Fort_Seat_stay001.material}
				name={nodes2.Fort_Seat_stay001.name}
			/>
			<mesh
				scale={nodes2.Handlebars.scale}
				geometry={nodes2.Handlebars.geometry}
				position={nodes2.Handlebars.position}
				rotation={nodes2.Handlebars.rotation}
				material={nodes2.Handlebars.material}
				name={nodes2.Handlebars.name}
			/>
			<mesh
				scale={nodes2.Handles.scale}
				geometry={nodes2.Handles.geometry}
				position={nodes2.Handles.position}
				rotation={nodes2.Handles.rotation}
				material={nodes2.Handles.material}
				name={nodes2.Handles.name}
			/>
			<mesh
				scale={nodes2.Head_tube.scale}
				geometry={nodes2.Head_tube.geometry}
				position={nodes2.Head_tube.position}
				rotation={nodes2.Head_tube.rotation}
				material={nodes2.Head_tube.material}
				name={nodes2.Head_tube.name}
			/>
			<mesh
				scale={nodes2.Hub_back.scale}
				geometry={nodes2.Hub_back.geometry}
				position={nodes2.Hub_back.position}
				rotation={nodes2.Hub_back.rotation}
				material={nodes2.Hub_back.material}
				name={nodes2.Hub_back.name}
			/>
			<mesh
				scale={nodes2.Hub_front.scale}
				geometry={nodes2.Hub_front.geometry}
				position={nodes2.Hub_front.position}
				rotation={nodes2.Hub_front.rotation}
				material={nodes2.Hub_front.material}
				name={nodes2.Hub_front.name}
			/>
			<mesh
				scale={nodes2.Paddle_1.scale}
				geometry={nodes2.Paddle_1.geometry}
				position={nodes2.Paddle_1.position}
				rotation={nodes2.Paddle_1.rotation}
				material={nodes2.Paddle_1.material}
				name={nodes2.Paddle_1.name}
			/>
			<mesh
				scale={nodes2.Paddle_2.scale}
				geometry={nodes2.Paddle_2.geometry}
				position={nodes2.Paddle_2.position}
				rotation={nodes2.Paddle_2.rotation}
				material={nodes2.Paddle_2.material}
				name={nodes2.Paddle_2.name}
			/>
			<mesh
				scale={nodes2.Saddle.scale}
				geometry={nodes2.Saddle.geometry}
				position={nodes2.Saddle.position}
				rotation={nodes2.Saddle.rotation}
				material={nodes2.Saddle.material}
				name={nodes2.Saddle.name}
			/>
			<mesh
				scale={nodes2.Screen_body.scale}
				geometry={nodes2.Screen_body.geometry}
				position={nodes2.Screen_body.position}
				rotation={nodes2.Screen_body.rotation}
				material={nodes2.Screen_body.material}
				name={nodes2.Screen_body.name}
			/>
			<mesh
				scale={nodes2.Screen_display.scale}
				geometry={nodes2.Screen_display.geometry}
				position={nodes2.Screen_display.position}
				rotation={nodes2.Screen_display.rotation}
				material={nodes2.Screen_display.material}
				name={nodes2.Screen_display.name}
			/>
			<mesh
				scale={nodes2.Seat_post.scale}
				geometry={nodes2.Seat_post.geometry}
				position={nodes2.Seat_post.position}
				rotation={nodes2.Seat_post.rotation}
				material={nodes2.Seat_post.material}
				name={nodes2.Seat_post.name}
			/>
			<mesh
				ref={spokeRef1}
				scale={nodes2.Spoke_1.scale}
				geometry={nodes2.Spoke_1.geometry}
				position={nodes2.Spoke_1.position}
				rotation={nodes2.Spoke_1.rotation}
				material={nodes2.Spoke_1.material}
				name={nodes2.Spoke_1.name}
			/>
			<mesh
				ref={spokeRef2}
				scale={nodes2.Spoke_2.scale}
				geometry={nodes2.Spoke_2.geometry}
				position={nodes2.Spoke_2.position}
				rotation={nodes2.Spoke_2.rotation}
				material={nodes2.Spoke_2.material}
				name={nodes2.Spoke_2.name}
			/>
			<mesh
				scale={nodes2.Stem.scale}
				geometry={nodes2.Stem.geometry}
				position={nodes2.Stem.position}
				rotation={nodes2.Stem.rotation}
				material={nodes2.Stem.material}
				name={nodes2.Stem.name}
			/>
			<mesh
				scale={nodes2.Top_Seat_tube.scale}
				geometry={nodes2.Top_Seat_tube.geometry}
				position={nodes2.Top_Seat_tube.position}
				rotation={nodes2.Top_Seat_tube.rotation}
				material={nodes2.Top_Seat_tube.material}
				name={nodes2.Top_Seat_tube.name}
			/>
			<mesh
				scale={nodes2.Torus001.scale}
				geometry={nodes2.Torus001.geometry}
				position={nodes2.Torus001.position}
				rotation={new Euler(0, 0, 11)} // todo: fix this
				material={nodes2.Torus001.material}
				name={nodes2.Torus001.name}
			/>
			<mesh
				scale={nodes2.Torus002.scale}
				geometry={nodes2.Torus002.geometry}
				position={nodes2.Torus002.position}
				rotation={nodes2.Torus002.rotation}
				material={nodes2.Torus002.material}
				name={nodes2.Torus002.name}
			/>
			{/* {Object.values(nodes2).map((node) => (
				<mesh
					scale={node.scale}
					geometry={node.geometry}
					position={node.position}
					rotation={node.rotation}
					material={node.material}
					name={node.name}
				/>
			))} */}
		</>
	);
}

export default Bike;
