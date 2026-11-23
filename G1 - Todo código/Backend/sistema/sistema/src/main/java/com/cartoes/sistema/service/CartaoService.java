
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


    public Cartao gerarCartao() {
        return gerarCartao("Não informado");
    }

    public Cartao gerarCartao(String nomeParticipante) {

        Cartao cartao = new Cartao();

        cartao.setCodigoQr(UUID.randomUUID().toString());
        cartao.setStatus("ATIVO");
        cartao.setSaldo(java.math.BigDecimal.ZERO);

        cartao.setNomeParticipante(
                nomeParticipante == null || nomeParticipante.isBlank()
                        ? "Não informado"
                        : nomeParticipante.trim()
        );

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

    // Validar cartão pelo código QR
    public String validarQrCode(String codigoQr) {

        return repository.findByCodigoQr(codigoQr)
                .map(cartao -> {

                    if ("BLOQUEADO".equals(cartao.getStatus())) {
                        return "E02 - Cartão bloqueado";
                    }

                    if ("ATIVO".equals(cartao.getStatus())) {
                        return "Cartão válido";
                    }

                    return "Status desconhecido";
                })
                .orElse("E01 - Cartão não encontrado");
    }

}
