{
  description = "Dev shell for littlebenlittle.github.io";

  nixConfig.bash-prompt = "[nix(littlebenlittle.github.io)] ";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-20.03";

  outputs = { self, nixpkgs }:
    {
      devShells.default = pkgs.mkShell {
        name = "littlebenlittle.github.io dev shell";
        packages = [
          pkgs.nodejs_20
        ];
      };
    };
}

