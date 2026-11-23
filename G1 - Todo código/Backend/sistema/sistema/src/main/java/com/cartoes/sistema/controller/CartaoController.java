
package com.cartoes.sistema.controller;

import com.cartoes.sistema.model.Cartao;
import com.cartoes.sistema.service.CartaoService;
import org.springframework.web.bind.annotation.*;
import com.cartoes.sistema.service.QrCodeService;
import com.cartoes.sistema.repository.CartaoRepository;
import com.google.zxing.WriterException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.IOException;


import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
@CrossOrigin(origins = "*")
public class CartaoController {
    private final QrCodeService qrCodeService;
    private final CartaoRepository repository;
    private final CartaoService service;


    public CartaoController(
            CartaoService service,
            QrCodeService qrCodeService,
            CartaoRepository repository) {

        this.service = service;
        this.qrCodeService = qrCodeService;
        this.repository = repository;
    }


    // Listar todos os cartões
    @GetMapping
    public List<Cartao> listarCartoes() {
        return service.listarCartoes();
    }


    @PostMapping
    public Cartao gerarCartao(
            @RequestBody(required = false)
            java.util.Map<String, String> dados) {

        String nome = dados == null
                ? "Não informado"
                : dados.getOrDefault(
                "nomeParticipante",
                "Não informado"
        );

        return service.gerarCartao(nome);
    }


    // Bloquear ou desbloquear cartão
    @PutMapping("/{id}/status")
    public Cartao alternarStatus(@PathVariable Long id) {
        return service.alternarStatus(id);
    }

    // Validar QR Code
    @GetMapping("/validar/{codigoQr}")
    public String validarQrCode(
            @PathVariable String codigoQr) {

        return service.validarQrCode(codigoQr);
    }

    // Gerar imagem QR Code de um cartão
    @GetMapping(value = "/{id}/qrcode",
            produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> gerarQrCode(
            @PathVariable Long id)
            throws WriterException, IOException {

        Cartao cartao = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Cartão não encontrado"
                        )
                );

        byte[] imagem = qrCodeService.gerarQrCode(
                cartao.getCodigoQr()
        );

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(imagem);
    }

}

