import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs-scene',
  template: '<div #rendererContainer></div>',
  styleUrls: ['./threejs-scene.component.css']
})
export class ThreejsSceneComponent implements OnInit {
  @ViewChild('rendererContainer', {static: true}) rendererContainer!: ElementRef<HTMLDivElement>;

  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cubes: THREE.Mesh[] = []; // Tableau pour stocker les cubes

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.createCubes(); // Appeler la méthode pour créer les cubes
      this.animate();
    });
  }

  initThree() {
    this.camera.position.z = 5;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  createCubes() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff]; // Couleurs des cubes
    const positions = [
      { x: -2, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 }
    ]; // Positions des cubes

    for (let i = 0; i < colors.length; i++) {
      const cubeGeometry = new THREE.BoxGeometry();
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: colors[i] });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.position.set(positions[i].x, positions[i].y, positions[i].z); // Positionner le cube
      this.scene.add(cube);
      this.cubes.push(cube); // Ajouter le cube au tableau
    }
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    this.cubes.forEach(cube => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
    requestAnimationFrame(() => this.animate());
  }
}
