# Yapp_Covey

COVEY 서버 개발 담당. 

//인증 부분은 모두 PASSPORTJS에서 사용자의 SESSION정보를 DB에 저장 후, 메모리 캐시를 이용해 KEY로 SESSIONID-인증번호로 사용자의 입력 인증번호와 MATCHING함.

FACEBOOK SNS인증 --> /ROUTES/AUTH/FACEBOOK: PASSPORT JS이용

휴대폰 인증 --> /ROUTES/AUTH/PHONE_AUTH : NAVER CLOUD PLATFORM의 SENS 이용. 

이메일 인증 --> /ROUTES/AUTH/EMAIL 

//이미지 업로드. 안드로이드에서 MULTER를 이용한 IMAGE UPLOAD요청이오면, 서버단에서 이미지를 받아 파일에 저장 후, 해당 경로를 DB에 저장한다. 사용자의 요청이 오면 해당 경로를 RETURN

이미지 업로드 --> /ROUTES/IMG/IMAGE_PRCOESS

//즐겨찾기. 사용자가 즐겨찾기 버튼을 누르면 즐겨찾기 테이블에 사용자 TABLE, 게시글 TABLE의 ID를 각각 가져와 즐겨찾기 테이블의 RECORD로 추가한다. 

즐겨찾기 --> /ROUTES/POSTS/INDEX.JS




