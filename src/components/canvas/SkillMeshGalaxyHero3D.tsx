import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SkillMeshGalaxyHero3DProps {
  className?: string;
  onSelectNode?: (name: string) => void;
}

export const SkillMeshGalaxyHero3D: React.FC<SkillMeshGalaxyHero3DProps> = ({
  className = '',
  onSelectNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Clear previous elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Particle Galaxy Generation (1,200 particles)
    const particlesCount = 1200;
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const colors = new Float32Array(particlesCount * 3);

    const colorPalette = [
      new THREE.Color(0x007aff), // Electric Blue
      new THREE.Color(0x5e5ce6), // Violet
      new THREE.Color(0x32ade6), // Cyan
      new THREE.Color(0xffffff)  // Pearl White
    ];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 12;

      sizes[i] = Math.random() * 2 + 0.5;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Glass Spheres / Core Skill Nodes (16 floating icosahedrons)
    const skillLabels = [
      'Python', 'PyTorch', 'TypeScript', 'Distributed Systems',
      'RAG Pipelines', 'Next.js', 'Docker', 'CUDA',
      'GraphQL', 'PostgreSQL', 'LangChain', 'Kubernetes',
      'System Architecture', 'CI/CD', 'Transformers', 'FastAPI'
    ];

    const nodes: {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      name: string;
    }[] = [];

    const nodeGeometry = new THREE.IcosahedronGeometry(0.22, 2);

    for (let i = 0; i < 16; i++) {
      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0xffffff : 0x0058bc,
        transparent: true,
        opacity: 0.65,
        shininess: 90,
        emissive: i % 3 === 0 ? 0x4a47d2 : 0x002244,
        emissiveIntensity: 0.3
      });

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      scene.add(node);

      nodes.push({
        mesh: node,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006
        ),
        name: skillLabels[i % skillLabels.length]
      });
    }

    // Dynamic Connections between nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x007aff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    const maxLines = 40;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x007aff, 1.8, 20);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0x6462ec, 1.2, 20);
    purpleLight.position.set(-4, -3, 3);
    scene.add(purpleLight);

    // Parallax mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Raycaster for click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = nodes.map(n => n.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = nodes.find(n => n.mesh === intersects[0].object);
        if (hit && onSelectNode) {
          onSelectNode(hit.name);
        }
      }
    };

    container.addEventListener('click', handleClick);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Particle rotation
      particleSystem.rotation.y += 0.0012;
      particleSystem.rotation.x += 0.0006;

      // Parallax smooth interpolation
      scene.rotation.y += (mouseX * 0.25 - scene.rotation.y) * 0.05;
      scene.rotation.x += (mouseY * 0.25 - scene.rotation.x) * 0.05;

      // Update Node positions & boundary bounces
      let lineIndex = 0;
      const positionsArray = lineMesh.geometry.attributes.position.array as Float32Array;

      nodes.forEach((n, idx) => {
        n.mesh.position.add(n.velocity);

        // Soft bounce boundaries
        if (Math.abs(n.mesh.position.x) > 4.2) n.velocity.x *= -1;
        if (Math.abs(n.mesh.position.y) > 3.2) n.velocity.y *= -1;
        if (Math.abs(n.mesh.position.z) > 3.5) n.velocity.z *= -1;

        n.mesh.rotation.y += 0.01;
        n.mesh.rotation.x += 0.005;

        // Connect nearby nodes with glowing neural filaments
        for (let j = idx + 1; j < nodes.length; j++) {
          const dist = n.mesh.position.distanceTo(nodes[j].mesh.position);
          if (dist < 2.5 && lineIndex < maxLines * 6) {
            positionsArray[lineIndex++] = n.mesh.position.x;
            positionsArray[lineIndex++] = n.mesh.position.y;
            positionsArray[lineIndex++] = n.mesh.position.z;

            positionsArray[lineIndex++] = nodes[j].mesh.position.x;
            positionsArray[lineIndex++] = nodes[j].mesh.position.y;
            positionsArray[lineIndex++] = nodes[j].mesh.position.z;
          }
        }
      });

      // Clear remaining line coordinates
      for (let i = lineIndex; i < maxLines * 6; i++) {
        positionsArray[i] = 0;
      }
      lineMesh.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [onSelectNode]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`} 
      id="skillmesh-galaxy-hero-3d"
    />
  );
};
