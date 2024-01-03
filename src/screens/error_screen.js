import { useRouteError } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const ErrorPageContainer = styled(Box)({
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    position: "relative",
    height: "80vh", // Set the height of the container to full viewport height
});

const ErrorTitle = styled(Typography)({
    fontSize: "24px",
    fontWeight: "bold",
});

const ErrorMessage = styled(Typography)({
    fontStyle: "italic",
});

export default function ErrorScreen() {
    const error = useRouteError();

    return (
        <ErrorPageContainer id="error-page">
            <ErrorTitle variant="h1">Oops!</ErrorTitle>
            <Typography variant="body1">
                Üzgünüz, bilinmeyen bir hata oluştu.
            </Typography>
            <ErrorMessage variant="body1">
                <i>{error.statusText || error.message}</i>
            </ErrorMessage>
        </ErrorPageContainer>
    );
}