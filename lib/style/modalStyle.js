export const modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        maxWidth: '500px',
        transform: 'translate(-50%, -50%)',
        border: '2px solid #F0F0F0',
        borderRadius: '20px',
        boxShadow: '0px 5px 30px lightgray',
    },
    overlay: {
        background: `radial-gradient(
            86.36% 107.55% at 6.49% 12.32%,
            var(--system0) 0%,
            rgba(255, 255, 255, 0.5) 100%
        )`,
        backdropFilter: `blur(3px)`,
        zIndex:20,
    }
};