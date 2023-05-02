package com.nyang.ourkitty.domain.client

import com.nyang.ourkitty.common.LocationCode
import com.nyang.ourkitty.common.UserCode
import com.nyang.ourkitty.common.dto.ResultDto
import com.nyang.ourkitty.domain.client.dto.ClientListResultDto
import com.nyang.ourkitty.domain.client.dto.ClientRequestDto
import com.nyang.ourkitty.domain.client.dto.ClientResponseDto
import com.nyang.ourkitty.exception.CustomException
import com.nyang.ourkitty.exception.ErrorCode
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime

@Api(tags = ["사용자 관련 API"])
@RestController
@RequestMapping("/client")
@CrossOrigin(origins = ["*"])
class ClientController(
    private val clientService: ClientService,
) {

    private val testToken = mapOf(
        "clientId" to 1L,
        "userCode" to UserCode.지자체.code,
        "locationCode" to LocationCode.해운대구.code,
    )

    /**
     * TODO : 캣맘 아이디 생성 (지자체)
     * @param clientRequestDto ClientRequestDto
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "사용자 아이디 생성")
    @PostMapping
    fun createAccount(clientRequestDto: ClientRequestDto): ResponseEntity<ResultDto<ClientResponseDto>> {

        if (testToken["userCode"].toString() != UserCode.지자체.code) throw CustomException(ErrorCode.NO_ACCESS)

        val client = clientService.createAccount(
            locationCode = testToken["locationCode"].toString(),
            clientRequestDto = clientRequestDto,
        )

        return ResponseEntity.ok(client)
    }

    /**
     * TODO : 캣맘 아이디 목록 조회 (지자체)
     * @return ResponseEntity<ResultDto<List<ClientResponseDto>>>
     */
    @ApiOperation(value = "사용자 아이디 목록 조회")
    @GetMapping
    fun getAccountList(
        @RequestParam("dishId", required = false) dishId: Long?,
        @RequestParam("searchKey", required = false) searchKey: String?,
        @RequestParam("searchWord", required = false, defaultValue = "") searchWord: String,
    ): ResponseEntity<ClientListResultDto> {

        if (testToken["userCode"].toString() != UserCode.지자체.code) throw CustomException(ErrorCode.NO_ACCESS)

        return ResponseEntity.ok(
            clientService.getClientList(
                locationCode = testToken["locationCode"].toString(),
                dishId = dishId,
                searchKey = searchKey,
                searchWord = searchWord,
            )
        )
    }

    /**
     * TODO : 캣맘 아이디 조회
     * @param clientId Long
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "사용자 아이디 조회")
    @GetMapping("/{clientId}")
    fun getAccount(@PathVariable("clientId") clientId: Long): ResponseEntity<ResultDto<ClientResponseDto>> {

        if (testToken["clientId"].toString().toLong() != clientId || testToken["userCode"].toString() != UserCode.지자체.code) throw CustomException(ErrorCode.NO_ACCESS)

        return ResponseEntity.ok(clientService.getClient(clientId))
    }

    /**
     * TODO : 개인정보 수정 - 캣맘
     * @param clientRequestDto ClientRequestDto
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "본인 아이디 정보 수정")
    @PutMapping("/mypage")
    fun modifyMyAccount(clientRequestDto: ClientRequestDto, @RequestParam(required = false) file: MultipartFile?): ResponseEntity<ResultDto<ClientResponseDto>> {

        val client = clientService.modifyMyAccount(
            clientId = testToken["clientId"].toString().toLong(),
            clientRequestDto = clientRequestDto,
            file = file
        )

        return ResponseEntity.ok(client)
    }

    /**
     * TODO : 개인정보 수정 - 지자체
     * @param clientId Long
     * @param clientRequestDto ClientRequestDto
     * @return ResponseEntity<ResultDto<ClientResponseDto>>
     */
    @ApiOperation(value = "소속 사용자 아이디 정보 수정")
    @PutMapping("/{clientId}")
    fun modifyAccount(@PathVariable("clientId") clientId: Long, clientRequestDto: ClientRequestDto): ResponseEntity<ResultDto<ClientResponseDto>> {

        if (testToken["userCode"].toString() != UserCode.지자체.code) throw CustomException(ErrorCode.NO_ACCESS)

        val clientResponseDto = clientService.modifyAccount(
            clientId = clientId,
            clientRequestDto = clientRequestDto
        )

        return ResponseEntity.ok(clientResponseDto)
    }

    /**
     * TODO : 캣맘 아이디 탈퇴 요청 (캣맘)
     * @param clientId Long
     * @return ResponseEntity<ResultDto<Boolean>>
     */
    @ApiOperation(value = "사용자 아이디 탈퇴")
    @DeleteMapping("/{clientId}")
    fun deleteAccount(@PathVariable clientId: Long, clientDescription: String): ResponseEntity<ResultDto<Boolean>> {

        if (testToken["clientId"].toString().toLong() != clientId || testToken["userCode"].toString() != UserCode.지자체.code) throw CustomException(ErrorCode.NO_ACCESS)

        return ResponseEntity.ok(
            clientService.deleteAccount(clientId, clientDescription)
        )
    }

    /**
     * TODO : 캣맘 아이디 비활성화 (지자체)
     * @param clientId Long
     * @return ResponseEntity<ResultDto<Boolean>>
     */
    @ApiOperation(value = "사용자 아이디 비활성화")
    @DeleteMapping("/{clientId}/block")
    fun deactivateAccount(@PathVariable clientId: Long, clientDescription: String, unBlockDate: LocalDateTime): ResponseEntity<ResultDto<Boolean>> {

        if (testToken["userCode"].toString() != UserCode.지자체.code) throw CustomException(ErrorCode.NO_ACCESS)

        return ResponseEntity.ok(
            clientService.deactivateAccount(clientId, clientDescription, unBlockDate)
        )
    }
}