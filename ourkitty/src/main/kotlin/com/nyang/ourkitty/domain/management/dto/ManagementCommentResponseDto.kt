package com.nyang.ourkitty.domain.management.dto

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class ManagementCommentResponseDto(
    val managementCommentId: Long,
    val managementCommentContent: String,
    val isDeleted: Boolean,
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    val createdDate: LocalDateTime,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    val updatedDate: LocalDateTime,
) {
}