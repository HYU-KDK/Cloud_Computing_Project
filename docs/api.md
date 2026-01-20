# API Contract (v1)

Base URL: /api  
Content-Type: application/json  
File Upload: multipart/form-data  

---

## 공통 에러 포맷

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "string",
    "details": {}
  }
}
