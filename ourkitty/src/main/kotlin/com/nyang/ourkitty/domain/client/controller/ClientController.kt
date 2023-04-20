package com.nyang.ourkitty.domain.client.controller

import com.nyang.ourkitty.common.dto.ResultDto
import com.nyang.ourkitty.domain.client.dto.ClientRequestDto
import com.nyang.ourkitty.domain.client.dto.ClientResponseDto
import com.nyang.ourkitty.domain.client.repository.ClientRepository
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Api(tags = ["사용자 관련 API"])
@RestController
@RequestMapping("/client")
class ClientController(
    private val clientRepository: ClientRepository
) {

    /**
     * TODO : 캣맘 아이디 생성 (지자체)
     * @param clientRequestDto ClientRequestDto
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "사용자 아이디 생성")
    @PostMapping
    fun createAccount(clientRequestDto: ClientRequestDto): ResponseEntity<ResultDto<ClientResponseDto>> {
        return ResponseEntity.ok(ResultDto(ClientResponseDto()))
    }

    /**
     * TODO : 캣맘 아이디 목록 조회 (지자체)
     * @return ResponseEntity<ResultDto<List<ClientResponseDto>>>
     */
    @ApiOperation(value = "사용자 아이디 목록 조회")
    @GetMapping
    fun getAccountList(): ResponseEntity<ResultDto<List<ClientResponseDto>>> {
        return ResponseEntity.ok(ResultDto(listOf(ClientResponseDto())))
    }

    /**
     * TODO : 캣맘 아이디 조회
     * @param clientId Long
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "사용자 아이디 조회")
    @GetMapping("/{clientId}")
    fun getAccount(@PathVariable("clientId") clientId: Long): ResponseEntity<ResultDto<ClientResponseDto>> {
        return ResponseEntity.ok(ResultDto(ClientResponseDto()))
    }

    /**
     * TODO : 개인정보 수정
     * @param clientId Long
     * @param clientRequestDto ClientRequestDto
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "사용자 아이디 정보 수정")
    @PutMapping("/{clientId}")
    fun modifyAccount(@PathVariable("clientId") clientId: Long, @RequestBody clientRequestDto: ClientRequestDto): ResponseEntity<ResultDto<ClientResponseDto>> {
        return ResponseEntity.ok(ResultDto(ClientResponseDto()))
    }

    /**
     * TODO : 캣맘 아이디 탈퇴 요청 (캣맘)
     * @param clientId Long
     * @return ResponseEntity<ResultDto<Boolean>>
     */
    @ApiOperation(value = "사용자 아이디 탈퇴 요청")
    @DeleteMapping("/{clientId}/request")
    fun deleteAccount(@PathVariable clientId: Long): ResponseEntity<ResultDto<Boolean>> {
        return ResponseEntity.ok(ResultDto(true))
    }

    /**
     * TODO : 캣맘 아이디 비활성화 (지자체)
     * @param clientId Long
     * @return ResponseEntity<ResultDto<Boolean>>
     */
    @ApiOperation(value = "사용자 아이디 활성화/비활성화")
    @DeleteMapping("/{clientId}")
    fun deactivateAccount(@PathVariable clientId: Long): ResponseEntity<ResultDto<Boolean>> {
        return ResponseEntity.ok(ResultDto(true))
    }
}