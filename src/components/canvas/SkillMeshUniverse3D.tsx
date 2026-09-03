import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SkillNode } from '../../types';

interface SkillMeshUniverse3DProps {
  skills: SkillNode[];
  selectedSkill: SkillNode | null;
  onSelectSkill: (skill: SkillNode) => void;
  mode?: 'default' | 'focus' | 'isolate' | 'compare';
  interactive?: boolean;
  className?: string;
}

export const SkillMeshUniverse3D: React.FC<SkillMeshUniverse3DProps> = ({
  skills,
  selectedSkill,
  onSelectSkill,
  mode = 'default',
  interactive = true,
  className = 'w-full h-full'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 7.5;
    camera.position.y = 0.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Particle Galaxy Halo
    const particlesCount = 1400;
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleColors = new Float32Array(particlesCount * 3);

    const colorPalette = [
      new THREE.Color(0x007aff), // Electric Blue
      new THREE.Color(0x5e5ce6), // Violet
      new THREE.Color(0x00c7be), // Cyan
      new THREE.Color(0xffffff)  // Pearl
    ];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 16;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 14;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors[i3] = c.r;
      particleColors[i3 + 1] = c.g;
      particleColors[i3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Node meshes
    const nodeMeshes: { mesh: THREE.Mesh; skill: SkillNode; ring: THREE.Mesh; innerCore: THREE.Mesh }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const ringGeo = new THREE.TorusGeometry(0.34, 0.015, 16, 32);
    const coreGeo = new THREE.IcosahedronGeometry(0.12, 2);

    skills.forEach((skill, idx) => {
      // Position calculation
      const angle = (idx / skills.length) * Math.PI * 2;
      const radius = 2.4 + (idx % 2 === 0 ? 0.6 : -0.3);
      const px = skill.position3D ? skill.position3D[0] : Math.cos(angle) * radius;
      const py = skill.position3D ? skill.position3D[1] : Math.sin(angle) * radius * 0.7;
      const pz = skill.position3D ? skill.position3D[2] : (Math.sin(idx * 1.5) * 1.2);

      const isMaster = skill.level === 'Master' || skill.level === 'Expert';
      const nodeColor = isMaster ? 0x007aff : (skill.status === 'gap' ? 0xec4899 : 0x5e5ce6);

      // Outer glass capsule
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });

      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(px, py, pz);
      mesh.userData = { skillId: skill.id, skill };

      // Inner glowing energy core
      const coreMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.95
      });
      const innerCore = new THREE.Mesh(coreGeo, coreMat);
      mesh.add(innerCore);

      // Orbiting pulse ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.45,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      mesh.add(ring);

      scene.add(mesh);
      nodeMeshes.push({ mesh, skill, ring, innerCore });
    });

    // Connection lines (Neural Links)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x007aff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const linesGroup = new THREE.Group();
    for (let i = 0; i < nodeMeshes.length; i++) {
      for (let j = i + 1; j < nodeMeshes.length; j++) {
        const s1 = nodeMeshes[i].skill;
        const s2 = nodeMeshes[j].skill;
        const isRelated = s1.leadsTo?.includes(s2.name) || s1.relatedSkills?.includes(s2.name) || s2.leadsTo?.includes(s1.name);
        
        if (isRelated || (i % 3 === j % 3)) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            nodeMeshes[i].mesh.position,
            nodeMeshes[j].mesh.position
          ]);
          const line = new THREE.Line(lineGeo, lineMat.clone());
          linesGroup.add(line);
        }
      }
    }
    scene.add(linesGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x007aff, 2.5, 20);
    pointLight1.position.set(4, 5, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x5e5ce6, 2.0, 20);
    pointLight2.position.set(-4, -4, 4);
    scene.add(pointLight2);

    // Interaction & Animation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseVector.x = x;
      mouseVector.y = y;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Raycast hover
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
      if (intersects.length > 0) {
        const found = intersects[0].object.userData.skill as SkillNode;
        setHoveredSkill(found);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        container.style.cursor = 'pointer';
      } else {
        setHoveredSkill(null);
        setTooltipPos(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
      if (intersects.length > 0) {
        const clicked = intersects[0].object.userData.skill as SkillNode;
        onSelectSkill(clicked);
      }
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      container.addEventListener('click', onClick);
    }

    let animationId: number;
    let clock = new THREE.Clock();

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05 + 0.0008;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;

      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Animate nodes & selection highlighting
      nodeMeshes.forEach(({ mesh, ring, innerCore, skill }, i) => {
        ring.rotation.z += 0.015;
        ring.rotation.y += 0.01;

        const isSelected = selectedSkill?.id === skill.id;
        const isHovered = hoveredSkill?.id === skill.id;
        const isNeighbor = selectedSkill?.leadsTo?.includes(skill.name) || selectedSkill?.relatedSkills?.includes(skill.name);

        if (mode === 'isolate' && selectedSkill) {
          if (isSelected || isNeighbor) {
            mesh.scale.set(1.2, 1.2, 1.2);
            (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.9;
          } else {
            mesh.scale.set(0.6, 0.6, 0.6);
            (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.15;
          }
        } else if (isSelected || isHovered) {
          mesh.scale.lerp(new THREE.Vector3(1.35, 1.35, 1.35), 0.1);
          (innerCore.material as THREE.MeshBasicMaterial).color.setHex(0x007aff);
        } else {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }

        // Float motion
        mesh.position.y += Math.sin(elapsedTime * 1.5 + i) * 0.0015;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('click', onClick);
      }
      resizeObs.disconnect();
      renderer.dispose();
    };
  }, [skills, selectedSkill, mode, interactive]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Dynamic Hover Tooltip */}
      {hoveredSkill && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 glass-pearl px-3 py-2 rounded-xl shadow-xl text-center border border-white/40 chromatic-edge"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="text-xs font-bold text-primary tracking-wide uppercase">{hoveredSkill.name}</div>
          <div className="text-[10px] text-outline font-medium">Mastery {hoveredSkill.masteryPercentage}% • {hoveredSkill.level}</div>
        </div>
      )}
    </div>
  );
};
