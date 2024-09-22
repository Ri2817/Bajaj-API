from django.shortcuts import render

# Create your views here.
import base64
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date

class BFHLView(APIView):
    def get(self, request):
        return Response({"operation_code": 1}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            data = request.data.get('data', [])
            file_b64 = request.data.get('file_b64', '')

            numbers = [item for item in data if item.isdigit()]
            alphabets = [item for item in data if item.isalpha()]
            highest_lowercase = max((char for char in alphabets if char.islower()), default=None)
            
            # File handling
            file_valid = False
            file_mime_type = None
            file_size_kb = None
            if file_b64:
                try:
                    file_data = base64.b64decode(file_b64)
                    file_valid = True
                    file_size_kb = len(file_data) / 1024
                    # Basic MIME type detection (you might want to use a library for more accurate detection)
                    if file_data.startswith(b'\x89PNG\r\n\x1a\n'):
                        file_mime_type = 'image/png'
                    elif file_data.startswith(b'\xff\xd8'):
                        file_mime_type = 'image/jpeg'
                    elif file_data.startswith(b'%PDF'):
                        file_mime_type = 'application/pdf'
                    else:
                        file_mime_type = 'application/octet-stream'
                except:
                    file_valid = False

            response_data = {
                "is_success": True,
                "user_id": f"Riya_Ranjan_28/05/2003",
                "email": "rr7455@stmist.edu.in",
                "roll_number": "RA2111031010037",
                "numbers": numbers,
                "alphabets": alphabets,
                "highest_lowercase_alphabet": [highest_lowercase] if highest_lowercase else [],
                "file_valid": file_valid,
            }

            if file_valid:
                response_data.update({
                    "file_mime_type": file_mime_type,
                    "file_size_kb": f"{file_size_kb:.2f}"
                })

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"is_success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)