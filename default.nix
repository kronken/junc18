with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "env";
  buildInputs = [
    bashInteractive
    unstable-small.nodejs-10_x
    unstable-small.yarn
    python3
    python36Packages.pip
  ];
}
