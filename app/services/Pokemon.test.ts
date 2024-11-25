import { describe, it, expect, beforeEach, vi } from "vitest";
import { PokemonService } from "~/services/PokemonService";
import { PokeApiClient } from "~/services/PokeApiClient";
import { Pokemon } from "~/services/pokemon";

vi.mock("~/services/PokeApiClient");

describe("Pokemon", () => {
  it("devrait retourner vrai si le Pokémon est génial", () => {
    // Given
    const pokemon = { isAwesome: true };

    // When
    const result = pokemon.isAwesome;

    // Then
    expect(result).toBe(true);
  });
});

describe("Service de Pokémon", () => {
  let pokeApiClient: PokeApiClient;
  let pokemonService: PokemonService;

  beforeEach(() => {
    pokeApiClient = new PokeApiClient();
    pokemonService = new PokemonService(pokeApiClient);
  });

  describe("getPokemonList", () => {
    it("devrait retourner une liste de Pokémon", async () => {
      const mockPokemonList: Pokemon[] = [
        { id: 1, name: "Bulbizarre", sprite: "sprite1.png", types: ["Plante", "Poison"] },
        { id: 2, name: "Herbizarre", sprite: "sprite2.png", types: ["Plante", "Poison"] },
      ];
      vi.mocked(pokeApiClient.getPokemonList).mockResolvedValue(mockPokemonList);

      const result = await pokemonService.getPokemonList();

      expect(result).toEqual(mockPokemonList);
      expect(pokeApiClient.getPokemonList).toHaveBeenCalled();
    });
  });

  describe("getUserTeam", () => {
    it("devrait retourner l'équipe de l'utilisateur", () => {
      const userId = "user1";
      const mockTeam: Pokemon[] = [{ id: 1, name: "Bulbizarre", sprite: "sprite1.png", types: ["Plante", "Poison"] }];
      pokemonService["userTeams"].set(userId, mockTeam);

      const result = pokemonService.getUserTeam(userId);

      expect(result).toEqual(mockTeam);
    });

    it("devrait retourner un tableau vide si l'utilisateur n'a pas d'équipe", () => {
      const userId = "user2";

      const result = pokemonService.getUserTeam(userId);

      expect(result).toEqual([]);
    });
  });

  describe("clearTeam", () => {
    it("devrait vider l'équipe de l'utilisateur", () => {
      const userId = "user1";
      const mockTeam: Pokemon[] = [{ id: 1, name: "Bulbizarre", sprite: "sprite1.png", types: ["Plante", "Poison"] }];
      pokemonService["userTeams"].set(userId, mockTeam);

      pokemonService.clearTeam(userId);

      expect(pokemonService.getUserTeam(userId)).toEqual([]);
    });
  });

  describe("togglePokemonInTeam", () => {
    it("devrait ajouter un Pokémon à l'équipe de l'utilisateur s'il n'est pas déjà présent", () => {
      const userId = "user1";
      const pokemon: Pokemon = { id: 1, name: "Bulbizarre", sprite: "sprite1.png", types: ["Plante", "Poison"] };

      const result = pokemonService.togglePokemonInTeam(userId, pokemon);

      expect(result).toBe(true);
      expect(pokemonService.getUserTeam(userId)).toContain(pokemon);
    });

    it("devrait retirer un Pokémon de l'équipe de l'utilisateur s'il est déjà présent", () => {
      const userId = "user1";
      const pokemon: Pokemon = { id: 1, name: "Bulbizarre", sprite: "sprite1.png", types: ["Plante", "Poison"] };
      pokemonService.togglePokemonInTeam(userId, pokemon);

      const result = pokemonService.togglePokemonInTeam(userId, pokemon);

      expect(result).toBe(true);
      expect(pokemonService.getUserTeam(userId)).not.toContain(pokemon);
    });

    it("ne devrait pas ajouter un Pokémon si l'équipe a déjà 6 Pokémon", () => {
      const userId = "user1";
      const pokemon: Pokemon = { id: 7, name: "Carapuce", sprite: "sprite7.png", types: ["Eau"] };
      const mockTeam: Pokemon[] = [
        { id: 1, name: "Bulbizarre", sprite: "sprite1.png", types: ["Plante", "Poison"] },
        { id: 2, name: "Herbizarre", sprite: "sprite2.png", types: ["Plante", "Poison"] },
        { id: 3, name: "Florizarre", sprite: "sprite3.png", types: ["Plante", "Poison"] },
        { id: 4, name: "Salamèche", sprite: "sprite4.png", types: ["Feu"] },
        { id: 5, name: "Reptincel", sprite: "sprite5.png", types: ["Feu"] },
        { id: 6, name: "Dracaufeu", sprite: "sprite6.png", types: ["Feu", "Vol"] },
      ];
      pokemonService["userTeams"].set(userId, mockTeam);

      const result = pokemonService.togglePokemonInTeam(userId, pokemon);

      expect(result).toBe(false);
      expect(pokemonService.getUserTeam(userId)).not.toContain(pokemon);
    });
  });
});