import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import FatText from "./FatText";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

const Card = styled.div`
    ${props => props.theme.whiteBox};
    flex-direction:column;
    align-items:center;
    padding:20px;
`;

const EAvatar = styled(Avatar)`
    margin-bottom:15px;
`

const ELink = styled(Link)`
    color:inherit;
`

const UserCard = ({id, name, isFollowing, url, isSelf }) => (
    <Card>
        <EAvatar url={url} size={"md"} />
        <ELink to={`/name}`}><FatText text={name} /></ELink>
        {!isSelf && <FollowButton id={id} isFollowing={isFollowing}/>}
    </Card>
);

UserCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    url: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired
};

export default UserCard;