class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * 
   * @param {Vec3} vec3 
   * @returns Vec3
   */
  sub(vec3) {
    this.x -= vec3.x;
    this.y -= vec3.y;
    this.z -= vec3.z;

    return this;
  }

  /**
   * 
   * @returns Vec3
   */
  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);

    return this;
  }

  /**
   * 
   * @param {Mat3} A 
   * @param {Vec3} b 
   * @param {Number} epsilon 
   * @returns Vec3
   */

  static jacobi(A, b, epsilon) {
    // TODO: epsilon
    // https://en.wikipedia.org/wiki/Jacobi_method
    // X(k + 1) = inverse(D) * (b - (L + U) * X(k))

    const D = new Mat3().setMain(A.getMain()).inverse();
    const LU = A.clone().setMain(new Vec3(0, 0, 0));

    let x = new Vec3(0, 0, 0);

    for(let i = 0; i < 20; ++i) {
      x = D.mltVec3(b.clone().sub(LU.mltVec3(x)));
    }

    return x;
  }
}

class Mat3 {
  constructor() {
    this.mat = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]
  }

  /**
   * 
   * @param {Vec3} vec 
   * @returns Mat3
   */
  setMain(vec) {
    this.mat[0] = vec.x;
    this.mat[4] = vec.y;
    this.mat[8] = vec.z;

    return this;
  }

  /**
   * 
   * @param {Vec3} vec3 
   * @returns Vec3
   */
  mltVec3(vec3) {
    const el = this.mat;
    const x = el[0] * vec3.x + el[1] * vec3.y + el[2] * vec3.z;
    const y = el[3] * vec3.x + el[4] * vec3.y + el[5] * vec3.z;
    const z = el[6] * vec3.x + el[7] * vec3.y + el[8] * vec3.z;

    return new Vec3(x, y, z);
  } 

  /**
   * 
   * @returns Vec3
   */
  getMain() {
    return new Vec3(this.mat[0], this.mat[4], this.mat[8]);
  }

  /**
   * 
   * @param {Mat3} mat4
   * @returnsMat3 
   */

  clone() {
    const res = new Mat3();

    res.mat = [...this.mat]

    return res;
  }

  /**
   * 
   * @returns Mat3 
   */
  inverse() {
    const te = this.mat,
		n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ],
		n12 = te[ 3 ], n22 = te[ 4 ], n32 = te[ 5 ],
		n13 = te[ 6 ], n23 = te[ 7 ], n33 = te[ 8 ],
		t11 = n33 * n22 - n32 * n23,
		t12 = n32 * n13 - n33 * n12,
		t13 = n23 * n12 - n22 * n13;

    const det = n11 * t11 + n21 *t12 + n31 * t13;

    if (det === 0) {
      this.mat = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ];

      return this;
    }

    const detInv = 1. / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
		te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

		te[ 3 ] = t12 * detInv;
		te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
		te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

		te[ 6 ] = t13 * detInv;
		te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
		te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

		return this;
  }

  print() {
    console.log(`|${this.mat[0]}, ${this.mat[1]}, ${this.mat[2]}|`)
    console.log(`|${this.mat[3]}, ${this.mat[4]}, ${this.mat[6]}|`)
    console.log(`|${this.mat[6]}, ${this.mat[7]}, ${this.mat[8]}|`)
  }

}

const A = new Mat3();
A.mat = [
  5, 2, -1,
  -4, 7, 3,
  2, -2, 4
];

const b = new Vec3(12, 24, 9);
const res = Vec3.jacobi(A, b, .1);

console.log(res);