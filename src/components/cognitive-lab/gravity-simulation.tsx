"use client";

import { RotateCcw, Play, Gauge } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./cognitive-engine-laboratory.module.css";

type GravitySimulationProps = { enabled: boolean };
type PhaserGameBridge = { destroy: (removeCanvas: boolean) => void; registry: { set: (key: string, value: unknown) => void } };
type VisualEngine = "phaser" | "matter" | "three";

export function GravitySimulation({ enabled }: GravitySimulationProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGameBridge | null>(null);
  const [gravity, setGravity] = useState(9.8);
  const [bounce, setBounce] = useState(0.35);
  const [engine, setEngine] = useState<VisualEngine>("phaser");
  const initialGravity = useRef(gravity);
  const initialBounce = useRef(bounce);

  useEffect(() => {
    if (!enabled || engine !== "phaser" || !hostRef.current || gameRef.current) return;
    let disposed = false;
    let game: PhaserGameBridge | undefined;

    void import("phaser").then(({ default: Phaser }) => {
      if (disposed || !hostRef.current) return;
      class GravityScene extends Phaser.Scene {
        private ball!: Phaser.Physics.Arcade.Image;
        private forceArrow!: Phaser.GameObjects.Graphics;
        private readout!: Phaser.GameObjects.Text;
        private groundY = 0;

        constructor() {
          super("GravityScene");
        }

        create() {
          const width = this.scale.width;
          this.groundY = this.scale.height - 42;
          const orbTexture = this.make.graphics({ x: 0, y: 0 });
          orbTexture.fillStyle(0xf4d35e, 1);
          orbTexture.fillCircle(18, 18, 18);
          orbTexture.lineStyle(2, 0xfff3a6, 1);
          orbTexture.strokeCircle(18, 18, 16);
          orbTexture.generateTexture("gravity-orb", 36, 36);
          orbTexture.destroy();

          this.add.rectangle(width / 2, this.groundY + 12, width - 28, 3, 0x48e5ff, 0.65);
          this.add.text(16, 14, "PHASER / ARCADE PHYSICS", { color: "#7fabb6", fontFamily: "monospace", fontSize: "10px" });
          this.readout = this.add.text(16, 32, "", { color: "#eaffff", fontFamily: "monospace", fontSize: "11px" });
          this.forceArrow = this.add.graphics();
          this.ball = this.physics.add.image(width * 0.5, 88, "gravity-orb");
          this.ball.setBounce(0.35);
          this.ball.setCollideWorldBounds(true);
          this.ball.setMaxVelocity(0, 1200);
          this.physics.world.setBounds(0, 0, width, this.groundY + 1);
          this.scale.on("resize", (size: { width: number; height: number }) => {
            this.groundY = size.height - 42;
            this.physics.world.setBounds(0, 0, size.width, this.groundY + 1);
          });
        }

        update() {
          const currentGravity = Number(this.registry.get("gravity") ?? 9.8);
          const currentBounce = Number(this.registry.get("bounce") ?? 0.35);
          const released = Boolean(this.registry.get("released"));
          this.physics.world.gravity.y = currentGravity * 52;
          this.ball.setBounce(currentBounce);
          if (!released) {
            this.ball.setVelocity(0, 0);
            this.ball.setPosition(this.scale.width * 0.5, 88);
          }
          const velocity = Math.round(this.ball.body?.velocity.y ?? 0);
          this.forceArrow.clear();
          this.forceArrow.lineStyle(2, 0xff7e5c, 0.9);
          this.forceArrow.beginPath();
          this.forceArrow.moveTo(this.ball.x, this.ball.y + 25);
          this.forceArrow.lineTo(this.ball.x, this.ball.y + 25 + Math.min(60, 18 + currentGravity * 2));
          this.forceArrow.strokePath();
          this.forceArrow.fillStyle(0xff7e5c, 1);
          this.forceArrow.fillTriangle(this.ball.x - 5, this.ball.y + 45 + Math.min(60, currentGravity * 2), this.ball.x + 5, this.ball.y + 45 + Math.min(60, currentGravity * 2), this.ball.x, this.ball.y + 55 + Math.min(60, currentGravity * 2));
          this.readout.setText(`g ${currentGravity.toFixed(1)} m/s²   v ${velocity} px/s   bounce ${currentBounce.toFixed(2)}`);
        }
      }

      const config = {
        type: Phaser.AUTO,
        parent: hostRef.current,
        width: "100%",
        height: 290,
        backgroundColor: "#020912",
        physics: { default: "arcade", arcade: { gravity: { x: 0, y: 9.8 * 52 }, debug: false } },
        scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: GravityScene
      };
      game = new Phaser.Game(config) as unknown as PhaserGameBridge;
      gameRef.current = game;
      gameRef.current?.registry.set("gravity", initialGravity.current);
      gameRef.current?.registry.set("bounce", initialBounce.current);
      gameRef.current?.registry.set("released", false);
    });

    return () => {
      disposed = true;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, [enabled, engine]);

  useEffect(() => { gameRef.current?.registry.set("gravity", gravity); }, [gravity]);
  useEffect(() => { gameRef.current?.registry.set("bounce", bounce); }, [bounce]);

  const reset = () => gameRef.current?.registry.set("released", false);
  const drop = () => gameRef.current?.registry.set("released", true);

  return <section className={styles.gravitySimulation} aria-label="Gravity visual simulation">
    <header className={styles.gravityHeader}><div><span>VISUAL EVIDENCE</span><strong><Gauge className="size-3.5" /> Gravity block</strong></div><small>Phaser real-time scene</small></header>
    {engine === "phaser" && <div ref={hostRef} className={styles.gravityCanvas} />}
    {engine === "matter" && <MatterGravityCanvas gravity={gravity} bounce={bounce} />}
    {engine === "three" && <ThreeGravityCanvas gravity={gravity} bounce={bounce} />}
    <div className={styles.gravityControls}>
      <label>Engine <select aria-label="Visual simulation engine" value={engine} onChange={(event) => setEngine(event.target.value as VisualEngine)}><option value="phaser">Phaser · Arcade Physics</option><option value="matter">Matter.js · Rigid Bodies</option><option value="three">Three.js · 3D Renderer</option></select></label>
      <label>Gravity <b>{gravity.toFixed(1)} m/s²</b><input aria-label="Gravity strength" type="range" min="0" max="20" step="0.1" value={gravity} onChange={(event) => setGravity(Number(event.target.value))} /></label>
      <label>Bounce <b>{bounce.toFixed(2)}</b><input aria-label="Bounce amount" type="range" min="0" max="0.9" step="0.05" value={bounce} onChange={(event) => setBounce(Number(event.target.value))} /></label>
      <div className={styles.gravityActions}><button type="button" onClick={drop}><Play className="size-3.5" /> Drop</button><button type="button" onClick={reset}><RotateCcw className="size-3.5" /> Reset</button></div>
    </div>
  </section>;
}

function MatterGravityCanvas({ gravity, bounce }: { gravity: number; bounce: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef({ gravity, bounce });
  valuesRef.current = { gravity, bounce };
  useEffect(() => {
    let disposed = false;
    void import("matter-js").then((Matter) => {
      if (disposed || !hostRef.current) return;
      const width = Math.max(320, hostRef.current.clientWidth);
      const height = 290;
      const engine = Matter.Engine.create({ gravity: { x: 0, y: 1 } });
      const render = Matter.Render.create({ element: hostRef.current, engine, options: { width, height, wireframes: false, background: "#020912" } });
      const ball = Matter.Bodies.circle(width * 0.5, 70, 18, { restitution: valuesRef.current.bounce, render: { fillStyle: "#bc92ff", strokeStyle: "#e6d6ff", lineWidth: 2 } });
      const ground = Matter.Bodies.rectangle(width * 0.5, height - 18, width - 28, 3, { isStatic: true, render: { fillStyle: "#48e5ff" } });
      const label = Matter.Bodies.rectangle(100, 30, 1, 1, { isStatic: true, render: { visible: false } });
      Matter.Composite.add(engine.world, [ball, ground, label]);
      Matter.Events.on(engine, "beforeUpdate", () => { engine.gravity.y = valuesRef.current.gravity / 9.8; Matter.Body.set(ball, "restitution", valuesRef.current.bounce); });
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);
      const caption = document.createElement("div");
      caption.textContent = "MATTER.JS / RIGID BODY PHYSICS";
      caption.className = styles.gravityEngineCaption;
      hostRef.current.appendChild(caption);
      return () => { Matter.Render.stop(render); Matter.Runner.stop(runner); Matter.Composite.clear(engine.world, false); Matter.Engine.clear(engine); render.canvas.remove(); caption.remove(); };
    });
    return () => { disposed = true; };
  }, []);
  return <div ref={hostRef} className={styles.gravityCanvas} />;
}

function ThreeGravityCanvas({ gravity, bounce }: { gravity: number; bounce: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef({ gravity, bounce });
  valuesRef.current = { gravity, bounce };
  useEffect(() => {
    let disposed = false;
    void import("three").then((THREE) => {
      if (disposed || !hostRef.current) return;
      const width = Math.max(320, hostRef.current.clientWidth);
      const height = 290;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#020912");
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 1.5, 6);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      hostRef.current.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xbfefff, 0x07111c, 2));
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 20), new THREE.MeshStandardMaterial({ color: 0xffc45e, emissive: 0x5c3e0a, roughness: 0.35 }));
      const floor = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.08, 1.8), new THREE.MeshStandardMaterial({ color: 0x48e5ff, emissive: 0x062c36 }));
      floor.position.y = -1.55;
      scene.add(orb, floor);
      let velocity = 0;
      let position = 1.4;
      let last = performance.now();
      const animate = (time: number) => {
        if (disposed) return;
        const delta = Math.min(0.035, (time - last) / 1000);
        last = time;
        velocity -= valuesRef.current.gravity * 0.45 * delta;
        position += velocity * delta;
        if (position < -1.15) { position = -1.15; velocity = Math.abs(velocity) * valuesRef.current.bounce; }
        orb.position.y = position;
        orb.rotation.x += delta * 0.8;
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);
      const caption = document.createElement("div");
      caption.textContent = "THREE.JS / WEBGL 3D RENDERER";
      caption.className = styles.gravityEngineCaption;
      hostRef.current.appendChild(caption);
      return () => { renderer.setAnimationLoop(null); renderer.dispose(); orb.geometry.dispose(); orb.material.dispose(); floor.geometry.dispose(); floor.material.dispose(); renderer.domElement.remove(); caption.remove(); };
    });
    return () => { disposed = true; };
  }, []);
  return <div ref={hostRef} className={styles.gravityCanvas} />;
}
