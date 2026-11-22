
package com.cartoes.sistema.service;

import com.cartoes.sistema.model.Cartao;
import com.cartoes.sistema.repository.CartaoRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CartaoService {

    private final CartaoRepository repository;

    public CartaoService(CartaoRepository repository) {
        this.repository = repository;
    }

    // Gerar um novo cartão
    public Cartao gerarCartao() {

        Cartao cartao = new Cartao();

        // Criar código único
        String codigo = UUID.randomUUID().toString();

        cartao.setCodigoQr(codigo);
        cartao.setStatus("ATIVO");

        return repository.save(cartao);
    }

    // Bloquear ou desbloquear cartão
    public Cartao alternarStatus(Long id) {

        Cartao cartao = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cartão não encontrado")
                );

        if (cartao.getStatus().equals("ATIVO")) {
            cartao.setStatus("BLOQUEADO");
        } else {
            cartao.setStatus("ATIVO");
        }

        return repository.save(cartao);
    }

    // Listar todos os cartões
    public java.util.List<Cartao> listarCartoes() {
        return repository.findAll();
    }
}
