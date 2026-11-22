
package com.cartoes.sistema.controller;

import com.cartoes.sistema.model.Cartao;
import com.cartoes.sistema.service.CartaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
@CrossOrigin(origins = "*")
public class CartaoController {

    private final CartaoService service;

    public CartaoController(CartaoService service) {
        this.service = service;
    }

    // Listar todos os cartões
    @GetMapping
    public List<Cartao> listarCartoes() {
        return service.listarCartoes();
    }

    // Gerar novo cartão
    @PostMapping
    public Cartao gerarCartao() {
        return service.gerarCartao();
    }

    // Bloquear ou desbloquear cartão
    @PutMapping("/{id}/status")
    public Cartao alternarStatus(@PathVariable Long id) {
        return service.alternarStatus(id);
    }
}
