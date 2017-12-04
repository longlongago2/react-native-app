import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, Text, StyleSheet } from 'react-native';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

class SearchPage extends PureComponent {
    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={{ textAlign: 'center', paddingVertical: 15 }}>
                    搜索结果：共
                    <Text style={{ color: 'green' }}>12</Text>
                    条
                </Text>
            </ScrollView>
        );
    }
}

SearchPage.propTypes = {};
export default connect()(SearchPage);
