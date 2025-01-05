/**
 *
 * PluginIcon
 *
 */
import { IoAddCircleOutline } from "react-icons/io5";
import { Flex } from '@strapi/design-system'
import styled from "styled-components";
import type { FC } from 'react'

const IconBox = styled(Flex)`

  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */

  border-radius:2.5px;
  width: 31px;
  height: 23px;

  svg > path {
    fill: #4945ff; /* primary600 */
    stroke: #f0f0ff
  }
  `;

export const PluginIcon: FC = () => <IconBox>
    <IoAddCircleOutline />
</IconBox>




